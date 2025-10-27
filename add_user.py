import pymysql
import bcrypt
import sys

# Database configuration (match with app.py)
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "tuitionpayment",
    "port": 3306
}

def connect_to_db():
    try:
        connection = pymysql.connect(**DB_CONFIG)
        return connection
    except pymysql.err.OperationalError as e:
        print(f"Database connection failed: {str(e)}")
        sys.exit(1)

def hash_password(plain_password):
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed

def add_user(username, full_name, phone, email, plain_password, balance):
    try:
        connection = connect_to_db()
        with connection.cursor() as cursor:
            # Hash the password
            hashed_password = hash_password(plain_password)
            
            # Insert user into the users table
            query = """
                INSERT INTO users (username, password, full_name, phone, email, balance)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (username, hashed_password, full_name, phone, email, balance))
            connection.commit()
            print(f"User {username} added successfully!")
    except pymysql.err.IntegrityError as e:
        print(f"Error: User {username} already exists or duplicate entry: {str(e)}")
    except pymysql.err.OperationalError as e:
        print(f"Database error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    # Example usage with command-line arguments or hardcoded values
    if len(sys.argv) != 6:
        print("Usage: python add-user.py <username> <full_name> <phone> <email> <balance>")
        print("Example: python add-user.py michael 'Michael Nguyen' '0901234567' 'michael@example.com' 1000000")
        sys.exit(1)
    
    username = sys.argv[1]
    full_name = sys.argv[2]
    phone = sys.argv[3]
    email = sys.argv[4]
    balance = float(sys.argv[5])  # Convert balance to float
    
    # Prompt for password (hidden input can be added with getpass if needed)
    plain_password = input("Enter password for the new user: ")
    
    add_user(username, full_name, phone, email, plain_password, balance)