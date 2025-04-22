from app import db, app  # Ensure you import both db and app
from sqlalchemy import inspect
from app import User  # Assuming User is your model

with app.app_context():
    # Check if the table exists
    inspector = inspect(db.engine)
    print(inspector.get_table_names())  # This will list all tables in the database

    # Print all entries from the 'user' table
    users = User.query.all()  # This assumes you have a User model defined with SQLAlchemy
    for user in User.query.all():
        print(user)
