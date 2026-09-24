import pandas as pd
import os

DATA_DIR = "data"
_cache: dict = {}

def _city_dir(city: str) -> str:
    return os.path.join(DATA_DIR, city.lower().replace(" ", "_").replace("/", "_"))

def _ensure(city: str):
    d = _city_dir(city)
    if not os.path.exists(f"{d}/traffic.csv"):
        from backend.services.generator import generate_all
        generate_all(d, city)

def _load(city: str, dataset: str) -> pd.DataFrame:
    key = f"{city}::{dataset}"
    if key not in _cache:
        _ensure(city)
        path = f"{_city_dir(city)}/{dataset}.csv"
        _cache[key] = pd.read_csv(path, parse_dates=["timestamp"])
    return _cache[key]

def load_traffic(city="New York"):     return _load(city, "traffic")
def load_energy(city="New York"):      return _load(city, "energy")
def load_air_quality(city="New York"): return _load(city, "air_quality")
def load_water(city="New York"):       return _load(city, "water")

def get_zones(city: str) -> list:
    from backend.services.city_profiles import get_profile
    return get_profile(city)["zones"]

def clear_cache(city: str = None):
    global _cache
    if city:
        _cache = {k: v for k, v in _cache.items() if not k.startswith(f"{city}::")}
    else:
        _cache = {}
