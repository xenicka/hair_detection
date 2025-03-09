from app import db, app  # Ensure you import both db and app
from sqlalchemy import inspect

with app.app_context():
    inspector = inspect(db.engine)
    print(inspector.get_table_names())  # This will list all tables in the database
