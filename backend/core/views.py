# core/views.py

import sys
import os
import requests
import logging
import joblib
import pandas as pd
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from core.models import MedicalRecord

logger = logging.getLogger(__name__)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load the saved models and encoders
try:
    pipeline_allergens = joblib.load('pipeline_allergens.pkl')
    pipeline_dietary = joblib.load('pipeline_dietary.pkl')
    le_allergens = joblib.load('le_allergens.pkl')
    le_dietary = joblib.load('le_dietary.pkl')
except Exception as e:
    logger.error(f"Failed to load one or more models: {str(e)}")
    raise

class PredictSuitabilityView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        barcode = request.data.get('barcode')
        print(barcode)
        if not barcode:
            logger.error("No barcode provided")
            return Response({'error': 'No barcode provided'}, status=status.HTTP_400_BAD_REQUEST)

        response = requests.get(f'https://world.openfoodfacts.org/api/v0/product/{barcode}.json')
        if response.status_code != 200:
            logger.error(f"Failed to fetch product data for barcode {barcode}")
            return Response({'error': 'Failed to fetch product data'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        product_data = response.json()
        if product_data.get('status') != 1:
            logger.error(f"Product not found for barcode {barcode}")
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        product_name = product_data['product'].get('product_name', 'Unknown Product')
        ingredients_text = product_data['product'].get('ingredients_text', '')

        input_data = pd.DataFrame({'product': [product_name], 'ingredients': [ingredients_text]})
        print(input_data)

        try:
            allergen_pred = pipeline_allergens.predict(input_data)[0]
            dietary_pred = pipeline_dietary.predict(input_data)[0]

            allergen = le_allergens.inverse_transform([allergen_pred])[0]
            dietary_restriction = le_dietary.inverse_transform([dietary_pred])[0]

            user = request.user
            user_profile = get_object_or_404(MedicalRecord, user=user)
            user_allergies = user_profile.allergies.split(',')
            user_dietary_restrictions = user_profile.dietary_restrictions.split(',')
            print(user_allergies,user_dietary_restrictions)

            if allergen in user_allergies or dietary_restriction in user_dietary_restrictions:
                return Response({'consumable': 'No', 'allergen': allergen, 'dietary_restriction': dietary_restriction,"product_name":product_name})

            return Response({'consumable': 'Yes', 'allergen': allergen, 'dietary_restriction': dietary_restriction,"product_name":product_name})

        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'error': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)
