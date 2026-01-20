from mongoengine import Document, StringField, EmailField, DateTimeField
import datetime

class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, min_length=6)
    username = StringField(max_length=50)
    created_at = DateTimeField(default=datetime.datetime.now)
    meta = {'collection': 'users'}