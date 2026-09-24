"""
forecast.py — ARIMA + Prophet dual forecast with MAPE comparison.
              Isolation Forest anomaly detection (replaces naive z-score).
"""

from fastapi import APIRouter
import pandas as pd
import numpy as np
from backend.services.data_loader import load_energy, load_traffic

router = APIRouter()


def _mape(actual, predicted):
    a, p = np.array(actual, dtype=float), np.array(predicted, dtype=float)
    mask = a != 0
    if not mask.any(): return None
    return round(float(np.mean(np.abs((a[mask]-p[mask])/a[mask]))*100), 2)


@router.get("/energy")
def forecast_energy(zone: str = None, steps: int = 24, city: str = "New York"):
    from backend.services.data_loader import get_zones
    if not zone: zone = get_zones(city)[0]

    df = load_energy(city)
    series = (df[df["zone"]==zone]
              .set_index("timestamp")["consumption_kwh"]
              .resample("h").mean().dropna())

    actual_vals = series[-steps:].round(2).tolist()
    labels = [str(t) for t in series[-steps:].index]
    result = {"labels": labels, "actual": actual_vals,
              "arima": None, "prophet": None,
              "arima_mape": None, "prophet_mape": None,
              "best_model": None}

    # ── ARIMA ──────────────────────────────────────────────────────
    try:
        from statsmodels.tsa.arima.model import ARIMA
        m = ARIMA(series[:-steps], order=(2,1,2)).fit()
        fc = m.get_forecast(steps=steps)
        result["arima"] = fc.predicted_mean.round(2).tolist()
        ci = fc.conf_int()
        result["arima_lower"] = ci.iloc[:,0].round(2).tolist()
        result["arima_upper"] = ci.iloc[:,1].round(2).tolist()
        result["arima_mape"] = _mape(actual_vals, result["arima"])
    except Exception as e:
        result["arima_error"] = str(e)

    # ── Prophet ────────────────────────────────────────────────────
    try:
        from prophet import Prophet
        train = series[:-steps].reset_index()
        train.columns = ["ds","y"]
        m = Prophet(daily_seasonality=True, weekly_seasonality=True,
                    yearly_seasonality=False, changepoint_prior_scale=0.05,
                    interval_width=0.95)
        m.fit(train)
        future = m.make_future_dataframe(periods=steps, freq="h")
        fc = m.predict(future).tail(steps)
        result["prophet"] = fc["yhat"].round(2).tolist()
        result["prophet_lower"] = fc["yhat_lower"].round(2).tolist()
        result["prophet_upper"] = fc["yhat_upper"].round(2).tolist()
        result["prophet_mape"] = _mape(actual_vals, result["prophet"])
    except Exception as e:
        result["prophet_error"] = str(e)

    # Pick best model by MAPE
    am, pm = result["arima_mape"], result["prophet_mape"]
    if am is not None and pm is not None:
        result["best_model"] = "ARIMA" if am < pm else "Prophet"
    elif am is not None:
        result["best_model"] = "ARIMA"
    elif pm is not None:
        result["best_model"] = "Prophet"

    # Peak forecast time
    best_vals = result.get("prophet") or result.get("arima") or []
    if best_vals and labels:
        peak_idx = int(np.argmax(best_vals))
        result["peak_time"] = labels[peak_idx][:16]
        result["peak_value"] = round(best_vals[peak_idx], 1)

    return result


@router.get("/anomalies")
def anomalies(zone: str = None, metric: str = "energy", city: str = "New York"):
    from backend.services.data_loader import get_zones
    if not zone: zone = get_zones(city)[0]

    if metric == "energy":
        df = load_energy(city); col = "consumption_kwh"
    else:
        df = load_traffic(city); col = "vehicle_count"

    series = (df[df["zone"]==zone]
              .set_index("timestamp")[col]
              .resample("h").mean().dropna())

    vals = series.values.reshape(-1, 1)

    # Isolation Forest (MLE-grade anomaly detection)
    method = "isolation_forest"
    try:
        from sklearn.ensemble import IsolationForest
        clf = IsolationForest(contamination=0.03, random_state=42, n_estimators=100)
        preds = clf.fit_predict(vals)
        scores = clf.score_samples(vals)
        anomaly_mask = preds == -1
    except ImportError:
        # Fallback to z-score if sklearn not available
        method = "zscore"
        mu, sigma = np.mean(vals), np.std(vals)
        anomaly_mask = np.abs((vals.flatten() - mu) / max(sigma, 1e-9)) > 2.5
        scores = -np.abs((vals.flatten() - mu) / max(sigma, 1e-9))

    recent = series[-168:]
    recent_mask = anomaly_mask[-168:]

    return {
        "labels": [str(t) for t in recent.index],
        "values": recent.round(2).tolist(),
        "anomaly_indices": [i for i, m in enumerate(recent_mask) if m],
        "anomaly_values": [round(float(recent.iloc[i]), 2) for i, m in enumerate(recent_mask) if m],
        "total_anomalies": int(anomaly_mask.sum()),
        "method": method,
    }
