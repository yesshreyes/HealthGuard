# import sys
# import os
#
# # Add the parent directory to the sys.path
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
#
# import joblib
# import pandas as pd
# from core.custom_encoders import LabelEncoderWithUnknown
#
# # Load the saved models and encoders
# pipeline_allergens = joblib.load('pipeline_allergens.pkl')
# pipeline_dietary = joblib.load('pipeline_dietary.pkl')
# le_allergens = joblib.load('le_allergens.pkl')
# le_dietary = joblib.load('le_dietary.pkl')
#
# # Define new product data
# new_data = pd.DataFrame({
#     'product': ['New Product 1', 'New Product 2'],
#     'ingredients': ['Yeast extract (contains BARLEY, WHEAT, OATS, RYE), salt, vegetable juice concentrate, vitamins (thiamin, riboflavin, niacin, vitamin B12 and folic acid), natural flavouring (contains CELERY).', 'carbonated water, sugar, caramel color, phosphoric acid, natural flavors, caffeine']
# })
#
# # Make predictions
# allergens_predictions = pipeline_allergens.predict(new_data)
# dietary_predictions = pipeline_dietary.predict(new_data)
#
# # Decode the predictions
# decoded_allergens_predictions = le_allergens.inverse_transform(allergens_predictions)
# decoded_dietary_predictions = le_dietary.inverse_transform(dietary_predictions)
#
# # Print the predictions
# for i, product in enumerate(new_data['product']):
#     print(f"Product: {product}")
#     print(f"Predicted Allergens: {decoded_allergens_predictions[i]}")
#     print(f"Predicted Dietary Restrictions: {decoded_dietary_predictions[i]}")
#     print()
