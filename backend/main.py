from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Event
from crud import get_events, create_event
import re
import datetime

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def to_camel_case(s):
    s = re.sub(r"_([a-zA-Z])", lambda m: m.group(1).upper(), s)
    return s


def model_to_dict(obj):
    result = {}
    for column in obj.__table__.columns:
        value = getattr(obj, column.name)
        if isinstance(value, datetime.datetime):
            result[column.name] = value.isoformat()
        else:
            result[column.name] = value
    return result

def dict_keys_to_camel(d):
    if isinstance(d, list):
        return [dict_keys_to_camel(i) for i in d]
    elif isinstance(d, dict):
        return {to_camel_case(k): dict_keys_to_camel(v) for k, v in d.items()}
    return d


@app.get("/events")
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = get_events(db, skip=skip, limit=limit)
  
    event_dicts = [dict_keys_to_camel(model_to_dict(e)) for e in events]
    return event_dicts


@app.post("/events")
def add_event(event: dict, db: Session = Depends(get_db)):
    new_event = create_event(db, event)
    event_dict = dict_keys_to_camel(model_to_dict(new_event))
    return event_dict

# Example: Custom endpoint to demonstrate direct DB query
@app.get("/events/count")
def count_events(db: Session = Depends(get_db)):
    count = db.query(Event).count()
    return dict_keys_to_camel({"total_events": count})
