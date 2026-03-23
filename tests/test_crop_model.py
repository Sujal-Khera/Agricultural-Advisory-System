import sys
import os
import unittest
import numpy as np
from unittest.mock import patch, MagicMock

# Add ml_models to path so we can import inference script
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(base_dir)

from ml_models.crop_model.inference import CropModelWrapper

class TestCropModel(unittest.TestCase):
    def setUp(self):
        self.model_dir = os.path.join(base_dir, 'ml_models', 'crop_model')
        # We assume the model has been trained and artifacts exist for the tests to run
        
    def test_model_loading(self):
        wrapper = CropModelWrapper(model_dir=self.model_dir)
        try:
            wrapper.load_model()
            self.assertTrue(True)
        except Exception as e:
            self.fail(f"load_model() raised Exception unexpectedly: {e}")
            
    def test_predict_format(self):
        wrapper = CropModelWrapper(model_dir=self.model_dir)
        
        # known average values
        result = wrapper.predict(
            n=90, p=42, k=43, 
            temperature=20.8, humidity=82.0, 
            ph=6.5, rainfall=202.9
        )
        
        self.assertIn('crop', result)
        self.assertIn('confidence', result)
        
        self.assertIsInstance(result['crop'], str)
        self.assertIsInstance(result['confidence'], float)
        self.assertTrue(0 <= result['confidence'] <= 100)

if __name__ == '__main__':
    unittest.main()
