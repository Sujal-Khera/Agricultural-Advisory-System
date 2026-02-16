import sys
import os

# Add ml_models to path so we can import the wrappers
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(base_dir)

from ml_models.crop_model.inference import CropModelWrapper
from models.schemas import CropRecommendationRequest

# Initialize wrapper (Singleton-like pattern for the service)
_crop_wrapper = None

def get_crop_wrapper():
    global _crop_wrapper
    if _crop_wrapper is None:
        _crop_wrapper = CropModelWrapper()
        _crop_wrapper.load_model()
    return _crop_wrapper

def get_crop_recommendation(request: CropRecommendationRequest):
    """
    Receives Pydantic request, passes to wrapper, returns dict.
    """
    wrapper = get_crop_wrapper()
    
    result = wrapper.predict(
        n=request.N,
        p=request.P,
        k=request.K,
        temperature=request.temperature,
        humidity=request.humidity,
        ph=request.ph,
        rainfall=request.rainfall
    )
    
    return result
