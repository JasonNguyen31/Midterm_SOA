from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import pymysql
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from payment_lock import PaymentLockManager

app = FastAPI()
Lock = PaymentLockManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to DB tuitionpayment
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "tuitionpayment",
    "port": 3306
}

EMAIL_SENDER = "guidervirus7486@gmail.com"  # Gmail
EMAIL_PASSWORD = "ttay zqmd cikv bsxr"  # App password from my mail
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


# Pydantic model for login request
class LoginCredentials(BaseModel):
    username: str
    password: str
# Pydantic model for login response
class LoginResponse(BaseModel):
    success: bool
    message: str
    user: dict | None = None
# Pydantic model for get customer data
class UserData(BaseModel):
    username: str
    full_name: str
    phone: str | None
    email: str
    balance: float

class StudentData(BaseModel):
    mssv: str
    full_name: str
    amount_due: float | None

class GenerateOTPRequest(BaseModel):
    username: str
    mssv: str

class VerifyOTPRequest(BaseModel):
    username: str
    mssv: str
    otp: str

class PaymentRequest(BaseModel):
    username: str
    mssv: str
    amount: float



def connect_to_db():
    try:
        connection = pymysql.connect(**DB_CONFIG)
        return connection
    except pymysql.err.OperationalError as e:
        raise HTTPException(status_code=500,detail=f"Database connection failed: {str(e)}")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify password using bcrypt
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

"""
The function to send email below.
Might need to modify it later.
"""

def send_email(to_email: str, subject: str, body: str):
    print(f"Sending email to {to_email} with subject: {subject}")  # Debug log
    msg = MIMEMultipart()
    msg['From'] = EMAIL_SENDER
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, to_email, msg.as_string())
        server.quit()
        print("Email sent successfully")  # Debug log
    except Exception as e:
        print(f"Error sending email: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")



@app.post("/api/login", response_model=LoginResponse)
async def login(credentials: LoginCredentials):
    try:
        connection = connect_to_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Query to check if username exists
            query = "SELECT username, password, full_name, email, phone, balance FROM users WHERE username = %s"
            cursor.execute(query, (credentials.username,))
            user = cursor.fetchone()

            if user and verify_password(credentials.password, user['password']):
                # Successful login
                user_data = {
                    
                    "username": user["username"],
                    "name": user["full_name"]
                }
                return {
                    "success": True,
                    "message": "Login successful",
                    "user": user_data
                }
            else:
                # Invalid credentials
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid username or password"
                )

    except pymysql.err.OperationalError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()

@app.get("/api/user/{username}", response_model=UserData)
async def get_user(username: str):
    try:
        connection = connect_to_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
                SELECT username, full_name, phone, email, balance
                FROM users
                WHERE username = %s
            """
            cursor.execute(query, (username,))
            user = cursor.fetchone()
            if user:
                return user
            raise HTTPException(status_code=404, detail="User not found")
    except pymysql.err.OperationalError as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()

@app.get("/api/student/{mssv}", response_model=StudentData)
async def get_student(mssv: str):
    try:
        connection = connect_to_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
                SELECT 
                    s.mssv, 
                    s.full_name, 
                    COALESCE(t.amount_due, 0) as amount_due
                FROM students s
                LEFT JOIN tuition_debts t ON s.mssv = t.mssv
                WHERE s.mssv = %s
            """
            cursor.execute(query, (mssv,))
            student = cursor.fetchone()
            if student:
                return student
            raise HTTPException(status_code=404, detail="Student not found")
    except pymysql.err.OperationalError as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()



@app.post("/api/generate-otp")
async def generate_otp(request: GenerateOTPRequest):
    print(f"Generating OTP for username: {request.username}, mssv: {request.mssv}")  # Debug log
    try:
        connection = connect_to_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Get user email
            query = "SELECT email FROM users WHERE username = %s"
            cursor.execute(query, (request.username,))
            user = cursor.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            user_email = user['email']
            print(f"User email: {user_email}")  # Debug log

            # Generate OTP
            otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            print(f"Generated OTP: {otp}")  # Debug log
            created_at = datetime.now()
            expiry = created_at + timedelta(minutes=5)

            # Store OTP in DB
            query = """
                INSERT INTO otps (username, otp, created_at, expiry, mssv)
                VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE otp = %s, created_at = %s, expiry = %s
            """
            cursor.execute(query, (request.username, otp, created_at, expiry, request.mssv, otp, created_at, expiry))
            connection.commit()
            print("OTP stored in DB")  # Debug log

            # Send OTP email
            send_email(user_email, "Your OTP Code", f"Your OTP code is {otp}. It expires in 5 minutes.")

            return {"success": True, "message": "OTP generated and sent"}
    except pymysql.err.OperationalError as e:
        print(f"Database error: {e}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()

@app.post("/api/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    print(f"Verifying OTP for username: {request.username}, mssv: {request.mssv}, otp: {request.otp}")  # Debug log
    try:
        connection = connect_to_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
                SELECT otp, expiry
                FROM otps
                WHERE username = %s AND mssv = %s AND otp = %s AND expiry > NOW()
            """
            cursor.execute(query, (request.username, request.mssv, request.otp))
            otp_record = cursor.fetchone()
            print(f"OTP record: {otp_record}")  # Debug log
            if otp_record:
                # Delete OTP after verification
                query = "DELETE FROM otps WHERE username = %s AND mssv = %s AND otp = %s"
                cursor.execute(query, (request.username, request.mssv, request.otp))
                connection.commit()
                print("OTP verified and deleted")  # Debug log
                return {"success": True, "message": "OTP verified"}
            else:
                print("Invalid or expired OTP")  # Debug log
                return {"success": False, "message": "Invalid or expired OTP"}

    except pymysql.err.OperationalError as e:
        print(f"Database error: {e}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()

@app.post("/api/payment")
async def process_payment(request: PaymentRequest):
    print(f"Processing payment for username: {request.username}, mssv: {request.mssv}, amount: {request.amount}")  # Debug log

    Lock.acquire(request.mssv)
    try:
        connection = connect_to_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Get user email and balance
            query = "SELECT email, balance FROM users WHERE username = %s"
            cursor.execute(query, (request.username,))
            user = cursor.fetchone()
            print(f"User details: {user}")  # Debug log
            if not user or user['balance'] < request.amount:
                print("Insufficient balance or user not found")  # Debug log
                raise HTTPException(status_code=400, detail="Insufficient balance or user not found")
            user_email = user['email']

            # Verify student debt
            query = "SELECT amount_due FROM tuition_debts WHERE mssv = %s"
            cursor.execute(query, (request.mssv,))
            debt = cursor.fetchone()
            print(f"Student debt: {debt}")  # Debug log
            if not debt or debt['amount_due'] != request.amount:
                print("Invalid payment amount or student not found")  # Debug log
                raise HTTPException(status_code=400, detail="Invalid payment amount or student not found")

            # Update user balance
            query = "UPDATE users SET balance = balance - %s WHERE username = %s"
            cursor.execute(query, (request.amount, request.username))
            print("User balance updated")  # Debug log

            # Update tuition debt to 0
            query = "UPDATE tuition_debts SET amount_due = 0 WHERE mssv = %s"
            cursor.execute(query, (request.mssv,))
            print("Tuition debt updated to 0")  # Debug log

            # Record payment history
            query = """
                INSERT INTO payment_histories (username, mssv, amount, date, status)
                VALUES (%s, %s, %s, %s, 'success')
            """
            cursor.execute(query, (request.username, request.mssv, request.amount, datetime.now()))
            print("Payment recorded in history")  # Debug log

            connection.commit()

            # Send success email
            send_email(user_email, "Payment Successful", f"Your payment of {request.amount} VND for student {request.mssv} was successful.")

            return {"success": True, "message": "Payment processed successfully"}
    except pymysql.err.OperationalError as e:
        print(f"Database error: {e}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()
        Lock.release(request.mssv)



# This is for add a new user only
@app.post("/api/add-user")
async def add_user_endpoint(request: dict):
       username = request.get("username")
       full_name = request.get("full_name")
       phone = request.get("phone")
       email = request.get("email")
       plain_password = request.get("password")
       balance = request.get("balance", 0.0)
       
       if not all([username, full_name, email, plain_password]):
           raise HTTPException(status_code=400, detail="Missing required fields")
       
       hashed_password = hash_password(plain_password)
       try:
           connection = connect_to_db()
           with connection.cursor() as cursor:
               query = """
                   INSERT INTO users (username, password, full_name, phone, email, balance)
                   VALUES (%s, %s, %s, %s, %s, %s)
               """
               cursor.execute(query, (username, hashed_password, full_name, phone, email, balance))
               connection.commit()
               return {"success": True, "message": f"User {username} added successfully"}
       except pymysql.err.IntegrityError:
           raise HTTPException(status_code=400, detail="User already exists")
       except Exception as e:
           raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
       finally:
           connection.close()
# 


# App run here
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)