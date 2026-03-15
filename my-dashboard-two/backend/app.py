from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

CSV_PATH = "data/pipeline_synthetic_2025.csv"

def load_data():
    df = pd.read_csv(CSV_PATH, parse_dates=["date"])
    return df

def pct_change(curr, prev):
    if prev == 0:
        return 0
    return ((curr - prev) / prev) * 100

@app.route("/api/kpis")
def kpis():
    df = load_data()

    latest = df.iloc[-1]
    prior = df.iloc[-2]

    ingested_delta = pct_change(latest["ingested"], prior["ingested"])
    validated_pass = (latest["validated"] / latest["ingested"]) * 100 if latest["ingested"] else 0
    auto_decided_rate = (latest["auto_decided"] / latest["validated"]) * 100 if latest["validated"] else 0
    manual_review_delta = pct_change(latest["manual_review"], prior["manual_review"])

    return jsonify({
        "ingested": {
            "value": int(latest["ingested"]),
            "delta": ingested_delta
        },
        "validated": {
            "value": int(latest["validated"]),
            "delta_text": f"{validated_pass:.1f}% pass"
        },
        "auto_decided": {
            "value": int(latest["auto_decided"]),
            "delta_text": f"{auto_decided_rate:.1f}% rate"
        },
        "manual_review": {
            "value": int(latest["manual_review"]),
            "delta": manual_review_delta
        }
    })

@app.route("/api/funnel")
def funnel():
    df = load_data()
    latest = df.iloc[-1]

    return jsonify([
        {"stage": "Ingested", "value": int(latest["ingested"])},
        {"stage": "Validated", "value": int(latest["validated"])},
        {"stage": "Rules Applied", "value": int(latest["rules_applied"])},
        {"stage": "Auto Decided", "value": int(latest["auto_decided"])},
        {"stage": "Approved", "value": int(latest["approved"])}
    ])



@app.route("/api/trend")
def trend():
    df = load_data().copy()

    trend_df = df[[
        "date",
        "ingested",
        "validated",
        "auto_decided",
        "manual_review"
    ]].tail(30)

    trend_df["date"] = trend_df["date"].dt.strftime("%Y-%m-%d")

    return jsonify(trend_df.to_dict(orient="records"))

@app.route("/api/outcomes")
def outcomes():
    df = load_data()

    latest = df.iloc[-1]

    approved = int(latest["approved"])
    manual = int(latest["manual_review"])
    denied = int(latest["denied"])
    error = int(latest["error_void"])

    total = approved + manual + denied + error

    if total == 0:
        return jsonify([
            {"label": "Approved", "value": approved, "pct": 0.0},
            {"label": "Manual Rev", "value": manual, "pct": 0.0},
            {"label": "Denied", "value": denied, "pct": 0.0},
            {"label": "Error/Void", "value": error, "pct": 0.0}
        ])

    return jsonify([
        {
            "label": "Approved",
            "value": approved,
            "pct": float((approved / total) * 100)
        },
        {
            "label": "Manual Rev",
            "value": manual,
            "pct": float((manual / total) * 100)
        },
        {
            "label": "Denied",
            "value": denied,
            "pct": float((denied / total) * 100)
        },
        {
            "label": "Error/Void",
            "value": error,
            "pct": float((error / total) * 100)
        }
    ])



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)