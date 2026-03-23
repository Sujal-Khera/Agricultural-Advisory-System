import sys
import os
import unittest
from unittest.mock import patch, MagicMock
from PIL import Image

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(base_dir)

from ml_models.disease_model.inference import DiseaseModelWrapper

class TestDiseaseModel(unittest.TestCase):
    def setUp(self):
        self.model_dir = os.path.join(base_dir, 'ml_models', 'disease_model')
        
    def test_model_loading(self):
        wrapper = DiseaseModelWrapper(model_dir=self.model_dir)
        try:
            wrapper.load_model()
            self.assertTrue(True)
        except Exception as e:
            self.fail(f"load_model() raised Exception unexpectedly: {e}")
            
    def test_predict_format(self):
        wrapper = DiseaseModelWrapper(model_dir=self.model_dir)
        
        # Check against local sample image if exists, else create a random dummy
        sample_img_path = os.path.join(base_dir, 'dataset', 'image.png')
        if not os.path.exists(sample_img_path):
            img = Image.new('RGB', (224, 224), color = 'red')
            img.save(sample_img_path)
            
        result = wrapper.predict(sample_img_path)
        
        self.assertIn('disease', result)
        self.assertIn('confidence', result)
        self.assertIn('top_3', result)
        
        self.assertIsInstance(result['disease'], str)
        self.assertIsInstance(result['confidence'], float)
        self.assertTrue(0 <= result['confidence'] <= 100)
        
        self.assertEqual(len(result['top_3']), 3)

if __name__ == '__main__':
    unittest.main()
