from sqlalchemy.orm import Session
from models import Event

def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Event).offset(skip).limit(limit).all()

def create_event(db: Session, event_data):
    import datetime
    event_data = dict(event_data)
    # Parse timestamp if it's a string
    ts = event_data.get('timestamp')
    if isinstance(ts, str):
        try:
            event_data['timestamp'] = datetime.datetime.fromisoformat(ts)
        except Exception:
            # fallback: try parsing common formats
            event_data['timestamp'] = datetime.datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S")
    db_event = Event(**event_data)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
