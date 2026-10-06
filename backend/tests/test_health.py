from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_predict_validates_input():
    r = client.post("/api/v1/predict", json={"symptoms": []})
    assert r.status_code == 422
