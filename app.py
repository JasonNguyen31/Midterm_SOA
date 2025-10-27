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
from email.utils import formataddr


app = FastAPI()


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

def send_email(to_email: str, subject: str, body: str, is_html: bool = False):
    print(f"Sending email to {to_email} with subject: {subject}")  # Debug log
    msg = MIMEMultipart()
    # Comment: This line sets the display name to "Tuition Payment App" instead of just the email address
    msg['From'] = formataddr(("Tuition Payment App", EMAIL_SENDER))
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html' if is_html else 'plain'))

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
            # Check if already ongoing for this username (any mssv)
            query = """
                SELECT * FROM ongoing_transactions WHERE username = %s
            """
            cursor.execute(query, (request.username,))
            existing = cursor.fetchone()
            if existing:
                raise HTTPException(status_code=400, detail="Đang có giao dịch diễn ra, vui lòng hoàn tất.")

            # Get user email
            query = "SELECT email FROM users WHERE username = %s"
            cursor.execute(query, (request.username,))
            user = cursor.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            user_email = user['email']

            # Generate OTP
            otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            created_at = datetime.now()
            expiry = created_at + timedelta(minutes=5)
            print(f"Generated OTP: {otp} for {request.username}")  # Debug log
            # Store OTP in DB
            query = """
                INSERT INTO otps (username, otp, created_at, expiry, mssv)
                VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE otp = %s, created_at = %s, expiry = %s
            """
            cursor.execute(query, (request.username, otp, created_at, expiry, request.mssv, otp, created_at, expiry))

            # Insert ongoing transaction
            query = """
                INSERT INTO ongoing_transactions (username, mssv, start_time, expiry)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query, (request.username, request.mssv, created_at, expiry + timedelta(minutes=5)))  # Extra buffer

            connection.commit()

            # Send OTP email (giữ nguyên)
            otp_html = otp_html = f"""
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Tuition Payment App - Mã OTP</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://via.placeholder.com/150x50/007BFF/FFFFFF?text=TPA" alt="Tuition Payment App Logo" style="max-width: 150px; height: auto;">
                        <h1 style="color: #333; font-size: 28px; margin: 10px 0; font-weight: bold;">Tuition Payment App</h1>
                        <p style="color: #666; font-size: 16px; margin: 0;">Mã Xác Thực OTP Của Bạn</p>
                        <p style="color: #666; font-size: 14px; margin: 5px 0 0;">Chúng tôi dùng mã này để xác thực giao dịch của bạn.</p>
                    </div>
                    
                    <!-- Phần OTP -->
                    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
                        <label style="display: block; color: #333; font-size: 14px; margin-bottom: 10px;">Mã OTP của bạn:</label>
                        <input type="text" value="{otp}" style="font-size: 24px; font-weight: bold; border: none; background: transparent; text-align: center; letter-spacing: 5px; width: 100%; max-width: 200px;" readonly>
                    </div>
                    
                    <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">Lưu ý: Mã này chỉ hợp lệ trong 5 phút.</p>
                    
                    <!-- Footer -->
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                        <p style="color: #666; font-size: 14px; margin: 0 0 10px;">Có câu hỏi hoặc gặp vấn đề?</p>
                        <p style="color: #666; font-size: 14px; margin: 0 0 10px;">Chỉ cần reply email này!</p>
                        <p style="color: #333; font-size: 16px; font-weight: bold; margin: 20px 0 0;">Trân trọng,</p>
                        <p style="color: #333; font-size: 16px; margin: 5px 0 0;">Đội ngũ Tuition Payment App</p>
                    </div>
                </div>
            </body>
            </html>
            """
            send_email(user_email, "Your OTP Code", otp_html, is_html=True)

            return {"success": True, "message": "OTP generated and sent"}
    except HTTPException as he:
        raise he
    except pymysql.err.OperationalError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()
@app.delete("/api/cancel-ongoing/{username}")
async def cancel_ongoing(username: str):
    try:
        connection = connect_to_db()
        with connection.cursor() as cursor:
            # Clean expired transactions
            cursor.execute("DELETE FROM ongoing_transactions WHERE expiry < NOW()")
            # Delete ongoing for username
            cursor.execute("DELETE FROM ongoing_transactions WHERE username = %s", (username,))
            connection.commit()
        return {"success": True}
    except pymysql.err.OperationalError as e:
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
    print(f"Processing payment for username: {request.username}, mssv: {request.mssv}, amount: {request.amount}")
    connection = connect_to_db()
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    max_retries = 3
    for attempt in range(max_retries):
        try:
            cursor.execute("START TRANSACTION;")
            cursor.execute("SELECT amount_due FROM tuition_debts WHERE mssv = %s FOR UPDATE;", (request.mssv,))
            debt = cursor.fetchone()
            if not debt or debt['amount_due'] <= 0:
                raise HTTPException(status_code=400, detail="Sinh viên này không có khoản nợ học phí nào!")
            if debt['amount_due'] != request.amount:
                raise HTTPException(status_code=400, detail="Invalid payment amount")
            
            cursor.execute("SELECT email, balance FROM users WHERE username = %s FOR UPDATE;", (request.username,))
            user = cursor.fetchone()
            if not user or user['balance'] < request.amount:
                raise HTTPException(status_code=400, detail="Insufficient balance or user not found")
            user_email = user['email']

            cursor.execute("UPDATE users SET balance = balance - %s WHERE username = %s;", (request.amount, request.username))
            cursor.execute("UPDATE tuition_debts SET amount_due = 0 WHERE mssv = %s;", (request.mssv,))
            cursor.execute("""
                INSERT INTO payment_histories (username, mssv, amount, date, status)
                VALUES (%s, %s, %s, %s, 'success');
            """, (request.username, request.mssv, request.amount, datetime.now()))
            cursor.execute("DELETE FROM ongoing_transactions WHERE username = %s", (request.username,))
            connection.commit()
            
            payment_html = payment_html = f"""
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Tuition Payment App - Thanh Toán Thành Công</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://via.placeholder.com/150x50/28A745/FFFFFF?text=TPA" alt="Tuition Payment App Logo" style="max-width: 150px; height: auto;">
                        <h1 style="color: #333; font-size: 28px; margin: 10px 0; font-weight: bold;">Tuition Payment App</h1>
                        <p style="color: #666; font-size: 16px; margin: 0;">Thanh Toán Thành Công!</p>
                        <p style="color: #666; font-size: 14px; margin: 5px 0 0;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                    </div>
                    
                    <!-- Phần chi tiết thanh toán -->
                    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <h2 style="color: #333; font-size: 18px; margin: 0 0 15px;">Chi Tiết Giao Dịch</h2>
                        <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Số tiền:</strong> {request.amount} VND</p>
                        <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>MSSV sinh viên:</strong> {request.mssv}</p>
                        <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Ngày thanh toán:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                        <p style="color: #28A745; font-size: 16px; font-weight: bold; margin: 15px 0 0; text-align: center;">Trạng thái: Thành công</p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                        <p style="color: #666; font-size: 14px; margin: 0 0 10px;">Có câu hỏi về giao dịch này?</p>
                        <p style="color: #666; font-size: 14px; margin: 0 0 10px;">Chỉ cần reply email này hoặc liên hệ support@tuitionpayment.com</p>
                        <p style="color: #333; font-size: 16px; font-weight: bold; margin: 20px 0 0;">Trân trọng,</p>
                        <p style="color: #333; font-size: 16px; margin: 5px 0 0;">Đội ngũ Tuition Payment App</p>
                    </div>
                </div>
            </body>
            </html>
            """
            send_email(user_email, "Payment Successful", payment_html, is_html=True)
            return {"success": True, "message": "Payment processed successfully"}
        except pymysql.err.OperationalError as e:
            connection.rollback()
            if attempt < max_retries - 1 and "Deadlock" in str(e):
                continue
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        except HTTPException as he:
            connection.rollback()
            raise he
        except Exception as e:
            connection.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        finally:
            cursor.close()
            connection.close()

@app.get("/api/check-ongoing/{username}")
async def check_ongoing(username: str):
    try:
        connection = connect_to_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Clean expired
            cursor.execute("DELETE FROM ongoing_transactions WHERE expiry < NOW()")
            connection.commit()

            query = """
                SELECT mssv FROM ongoing_transactions WHERE username = %s
            """
            cursor.execute(query, (username,))
            ongoing = cursor.fetchone()
            if ongoing:
                return {"ongoing": True, "mssv": ongoing['mssv']}
            return {"ongoing": False}
    except pymysql.err.OperationalError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()

@app.get("/api/payment-history/{username}")
async def get_payment_history(username: str):
    try:
        connection = connect_to_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
                SELECT ph.id, ph.mssv, s.full_name, ph.amount, ph.date, ph.status
                FROM payment_histories ph
                LEFT JOIN students s ON ph.mssv = s.mssv
                WHERE ph.username = %s
                ORDER BY ph.date DESC
            """
            cursor.execute(query, (username,))
            history = cursor.fetchall()
        return {"history": history}
    except pymysql.err.OperationalError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()


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