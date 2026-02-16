import httpx
from datetime import datetime, timedelta
from utils.config import settings

# In-memory cache for weather data
# Key: (lat_rounded, lon_rounded), Value: {"data": dict, "expires_at": datetime}
weather_cache = {}
CACHE_TTL_HOURS = 2

async def get_weather(lat: float, lon: float):
    """
    Fetch weather from OpenWeatherMap mapping to 1 decimal point cache (approx 11km).
    Returns a dict with weather details.
    """
    # Round to 1 decimal place to group close locations
    lat_rounded = round(lat, 1)
    lon_rounded = round(lon, 1)
    cache_key = (lat_rounded, lon_rounded)

    # Check cache
    if cache_key in weather_cache:
        cached = weather_cache[cache_key]
        if datetime.now() < cached["expires_at"]:
            return cached["data"]

    if not settings.OPENWEATHER_API_KEY:
        # Graceful fallback if no API key
        return {
            "temperature": 25.0,
            "humidity": 60.0,
            "pressure": 1013,
            "wind_speed": 5.0,
            "description": "API Key Missing",
            "rain_mm": 0,
            "icon": "01d"
        }
        
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={settings.OPENWEATHER_API_KEY}&units=metric"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            # Parse useful data
            rain_mm = 0
            if "rain" in data and "1h" in data["rain"]:
                rain_mm = data["rain"]["1h"]
                
            weather_parsed = {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "pressure": data["main"]["pressure"],
                "wind_speed": data["wind"]["speed"],
                "description": data["weather"][0]["description"].capitalize(),
                "rain_mm": rain_mm,
                "icon": data["weather"][0]["icon"]
            }
            
            # Save to memory cache
            weather_cache[cache_key] = {
                "data": weather_parsed,
                "expires_at": datetime.now() + timedelta(hours=CACHE_TTL_HOURS)
            }
            
            # Fire-and-forget saving to Supabase for historical tracking (we can do it here directly or in routes)
            from services.supabase_service import save_weather as sb_save_weather
            import asyncio
            # In a real async App, we'd use asyncio.create_task or BackgroundTasks
            # For simplicity, we just call it synchronously as it uses synchronous supabase client
            sb_save_weather(lat, lon, weather_parsed["temperature"], weather_parsed["humidity"], 
                          weather_parsed["pressure"], weather_parsed["wind_speed"], 
                          weather_parsed["description"], weather_parsed["rain_mm"])
            
            return weather_parsed
            
    except Exception as e:
        print(f"Error fetching weather: {e}")
        # Fallback values
        return {
            "temperature": 25.0,
            "humidity": 60.0,
            "pressure": 1013,
            "wind_speed": 5.0,
            "description": "Error fetching weather",
            "rain_mm": 0,
            "icon": "01d"
        }
