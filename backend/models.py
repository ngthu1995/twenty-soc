from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime)
    event_type = Column(String)
    severity = Column(String)
    source = Column(String)
    user_id = Column(String)
    status = Column(String)
