from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_events():
    response = client.get("/events")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_post_event():
    event = {
        "timestamp": "2025-09-07T12:00:00",
        "event_type": "Login",
        "severity": "High",
        "source": "USA",
        "user_id": "user1",
        "status": "Open"
    }
    response = client.post("/events", json=event)
    assert response.status_code == 200
    data = response.json()
    assert "eventType" in data
    assert data["eventType"] == "Login"

def test_count_events():
    response = client.get("/events/count")
    assert response.status_code == 200
    data = response.json()
    assert "totalEvents" in data
    assert isinstance(data["totalEvents"], int)
