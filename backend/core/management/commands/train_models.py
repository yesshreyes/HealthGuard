# your_app/management/commands/train_models.py

from django.core.management.base import BaseCommand
import joblib
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import random
import numpy as np

from core.custom_encoders import LabelEncoderWithUnknown


class Command(BaseCommand):
    help = 'Train and save machine learning models'

    def handle(self, *args, **kwargs):
        # Define the path to the downloads directory
        downloads_dir = 'C:\\Users\\HP EliteBook 840\\Downloads'

        # Load the datasets
        df1 = pd.read_csv(os.path.join(downloads_dir, 'product_suitability_dataset.csv'))
        df2 = pd.read_csv(os.path.join(downloads_dir, 'new_product_suitability_dataset.csv'))

        df = pd.concat([df1, df2], ignore_index=True)

        # Define keywords for common allergens and dietary restrictions
        allergen_keywords = {
            'Milk': ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
            'Wheat': ['wheat', 'bread', 'pasta', 'flour', 'cracker'],
            'Soy': ['soy', 'tofu', 'edamame', 'soybean'],
            'Peanuts': ['peanut', 'peanut butter'],
            'Tree nuts': ['almond', 'walnut', 'cashew', 'pecan'],
            'Fish': ['fish', 'salmon', 'tuna', 'cod'],
            'Shellfish': ['shrimp', 'crab', 'lobster'],
            'Eggs': ['egg', 'mayonnaise'],
            'None': ['none']
        }

        dietary_keywords = {
            'Lactose intolerance': ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
            'Gluten sensitivity': ['wheat', 'bread', 'pasta', 'flour', 'cracker'],
            'Nut allergy': ['peanut', 'peanut butter', 'almond', 'walnut', 'cashew', 'pecan'],
            'Caffeine sensitivity': ['coffee', 'tea'],
            'None': ['none']
        }

        allergen_labels = list(allergen_keywords.keys())
        dietary_labels = list(dietary_keywords.keys())

        # Fill NaN values in 'product' and 'ingredients' with an empty string
        df['product'] = df['product'].fillna('')
        df['ingredients'] = df['ingredients'].fillna('')

        # Fill empty values in 'allergens' and 'dietary_restrictions' columns with random data
        df['allergens'] = df['allergens'].apply(lambda x: random.choice(allergen_labels) if pd.isna(x) or x == '' else x)
        df['dietary_restrictions'] = df['dietary_restrictions'].apply(lambda x: random.choice(dietary_labels) if pd.isna(x) or x == '' else x)

        # Encode the categorical variables with the new encoder
        le_allergens = LabelEncoderWithUnknown()
        df['allergens_encoded'] = le_allergens.fit_transform(df['allergens'])

        le_dietary = LabelEncoderWithUnknown()
        df['dietary_restrictions_encoded'] = le_dietary.fit_transform(df['dietary_restrictions'])

        # Features and target
        X = df[['product', 'ingredients']]
        y_allergens = df['allergens_encoded']
        y_dietary = df['dietary_restrictions_encoded']

        # Split the data into training and testing sets
        X_train, X_test, y_train_allergens, y_test_allergens = train_test_split(X, y_allergens, test_size=0.2, random_state=42)
        _, _, y_train_dietary, y_test_dietary = train_test_split(X, y_dietary, test_size=0.2, random_state=42)

        # Define preprocessing steps
        preprocessor = ColumnTransformer(
            transformers=[
                ('product', TfidfVectorizer(), 'product'),
                ('ingredients', TfidfVectorizer(), 'ingredients')
            ])

        # Define the model pipeline for allergens prediction
        pipeline_allergens = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ])

        # Define the model pipeline for dietary restrictions prediction
        pipeline_dietary = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ])

        # Train the models
        pipeline_allergens.fit(X_train, y_train_allergens)
        pipeline_dietary.fit(X_train, y_train_dietary)

        # Evaluate the models
        y_pred_allergens = pipeline_allergens.predict(X_test)
        y_pred_dietary = pipeline_dietary.predict(X_test)

        accuracy_allergens = accuracy_score(y_test_allergens, y_pred_allergens)
        accuracy_dietary = accuracy_score(y_test_dietary, y_pred_dietary)

        print(f"Allergens Prediction Accuracy: {accuracy_allergens * 100:.2f}%")
        print(f"Dietary Restrictions Prediction Accuracy: {accuracy_dietary * 100:.2f}%")

        # Save the models and pipelines
        joblib.dump(pipeline_allergens, 'pipeline_allergens.pkl')
        joblib.dump(pipeline_dietary, 'pipeline_dietary.pkl')
        joblib.dump(le_allergens, 'le_allergens.pkl')
        joblib.dump(le_dietary, 'le_dietary.pkl')
