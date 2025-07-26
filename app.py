from flask import Flask, render_template, request, jsonify, redirect, url_for, session, send_from_directory
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import os
from datetime import datetime, timedelta
import jwt
from functools import wraps
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key-change-in-production')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/nutribaba')

mongo = PyMongo(app)

def send_email(to_email, subject, body):
    """Send email using SMTP"""
    try:
        msg = MIMEMultipart()
        msg['From'] = os.getenv('EMAIL_USER')
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(os.getenv('EMAIL_HOST'), int(os.getenv('EMAIL_PORT', 587)))
        server.starttls()
        server.login(os.getenv('EMAIL_USER'), os.getenv('EMAIL_PASS'))
        
        text = msg.as_string()
        server.sendmail(os.getenv('EMAIL_USER'), to_email, text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

def generate_otp():
    """Generate 6-digit OTP"""
    return str(random.randint(100000, 999999))

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = session.get('token')
        if not token:
            return redirect(url_for('login'))
        
        try:
            payload = jwt.decode(token, os.getenv('JWT_SECRET', 'default-jwt-secret'), algorithms=['HS256'])
            session['user_id'] = payload['user_id']
        except jwt.ExpiredSignatureError:
            session.clear()
            return redirect(url_for('login'))
        except jwt.InvalidTokenError:
            session.clear()
            return redirect(url_for('login'))
        
        return f(*args, **kwargs)
    return decorated_function

def get_user_data(user_id):
    """Get user data by ID"""
    try:
        return mongo.db.users.find_one({'_id': ObjectId(user_id)})
    except Exception as e:
        print(f"Error fetching user data: {e}")
        return None

def calculate_daily_calories(user):
    """Calculate daily caloric needs based on user data"""
    if not user or not all(key in user for key in ['age', 'gender', 'height', 'weight', 'activityLevel']):
        return None
    
    # Calculate BMR using Mifflin-St Jeor Equation
    weight = user['weight']
    height = user['height']
    age = user['age']
    gender = user['gender']
    
    if gender == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    
    # Activity multipliers
    activity_multipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
    }
    
    multiplier = activity_multipliers.get(user['activityLevel'], 1.2)
    daily_calories = int(bmr * multiplier)
    
    # Adjust based on goal
    goal = user.get('primaryGoal', '')
    if goal == 'weight_loss':
        daily_calories -= 500  # 1 lb per week loss
    elif goal == 'weight_gain':
        daily_calories += 500  # 1 lb per week gain
    
    return daily_calories

def prepare_profile_data(data, user_id=None):
    """Prepare and validate profile data"""
    try:
        age = int(data['age'])
        height = float(data['height'])
        weight = float(data['weight'])
        
        if not (13 <= age <= 120):
            raise ValueError('Age must be between 13 and 120')
        if not (100 <= height <= 250):
            raise ValueError('Height must be between 100 and 250 cm')
        if not (30 <= weight <= 300):
            raise ValueError('Weight must be between 30 and 300 kg')
            
    except ValueError as e:
        return None, str(e)
    
    # Calculate BMI
    bmi = weight / ((height / 100) ** 2)
    
    # Prepare profile data
    profile_data = {
        # Personal Information
        'firstName': data['firstName'].strip(),
        'lastName': data['lastName'].strip(),
        'email': data['email'].strip().lower(),
        'phone': data.get('phone', '').strip(),
        'age': age,
        'gender': data['gender'],
        
        # Physical Measurements
        'height': height,
        'weight': weight,
        'targetWeight': float(data['targetWeight']) if data.get('targetWeight') else None,
        'activityLevel': data['activityLevel'],
        'bmi': round(bmi, 1),
        
        # Health Information
        'healthConditions': data.get('healthConditions', []),
        'medications': data.get('medications', '').strip(),
        
        # Dietary Preferences
        'dietType': data['dietType'],
        'mealsPerDay': data.get('mealsPerDay', ''),
        'allergies': data.get('allergies', []),
        'foodDislikes': data.get('foodDislikes', '').strip(),
        
        # Goals & Lifestyle
        'primaryGoal': data['primaryGoal'],
        'waterIntake': data.get('waterIntake', ''),
        'sleepHours': data.get('sleepHours', ''),
        'stressLevel': data.get('stressLevel', ''),
        
        # Meta data
        'profile_complete': True,
        'profile_updated_at': datetime.utcnow()
    }
    
    # Calculate daily caloric needs
    profile_data['daily_calories'] = calculate_daily_calories(profile_data)
    
    return profile_data, None

# Static files and favicon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

# Routes
@app.route('/')
def index():
    """Home page - redirect based on login status"""
    if 'user_id' in session:
        user = get_user_data(session['user_id'])
        if user and user.get('profile_complete'):
            return redirect(url_for('dashboard'))
        else:
            return redirect(url_for('profile'))
    return render_template('index.html')

@app.route('/login')
def login():
    # If user is already logged in, redirect appropriately
    if 'user_id' in session:
        user = get_user_data(session['user_id'])
        if user and user.get('profile_complete'):
            return redirect(url_for('dashboard'))
        else:
            return redirect(url_for('profile'))
    return render_template('login.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password required'})
        
        user = mongo.db.users.find_one({'email': email})
        
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'success': False, 'message': 'Invalid credentials'})
        
        if not user.get('email_verified', False):
            return jsonify({'success': False, 'message': 'Please verify your email first'})
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(days=7)
        }, os.getenv('JWT_SECRET', 'default-jwt-secret'), algorithm='HS256')
        
        session['token'] = token
        session['user_id'] = str(user['_id'])
        
        # Update last login
        mongo.db.users.update_one(
            {'_id': user['_id']},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        # Check if profile is complete
        has_profile = user.get('profile_complete', False)
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'redirect': 'profile' if not has_profile else 'dashboard'
        })
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/api/signup', methods=['POST'])
def api_signup():
    try:
        data = request.get_json()
        
        required_fields = ['firstName', 'lastName', 'email', 'password']
        if not all(field in data and data[field].strip() for field in required_fields):
            return jsonify({'success': False, 'message': 'All fields are required'})
        
        # Normalize email
        email = data['email'].strip().lower()
        
        # Basic email validation
        if '@' not in email or '.' not in email.split('@')[1]:
            return jsonify({'success': False, 'message': 'Please enter a valid email address'})
        
        # Check if user already exists
        if mongo.db.users.find_one({'email': email}):
            return jsonify({'success': False, 'message': 'User already exists'})
        
        # Password validation
        password = data['password']
        if len(password) < 8:
            return jsonify({'success': False, 'message': 'Password must be at least 8 characters long'})
        
        # Generate OTP
        otp = generate_otp()
        otp_expiry = datetime.utcnow() + timedelta(minutes=10)
        
        # Create user document
        user_doc = {
            'firstName': data['firstName'].strip(),
            'lastName': data['lastName'].strip(),
            'email': email,
            'password': generate_password_hash(password),
            'email_verified': False,
            'profile_complete': False,
            'otp': otp,
            'otp_expiry': otp_expiry,
            'created_at': datetime.utcnow(),
            'last_login': None
        }
        
        result = mongo.db.users.insert_one(user_doc)
        
        # Send OTP email
        subject = "Verify Your NutriBaba Account"
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0ea5e9; margin-bottom: 10px;">Welcome to NutriBaba!</h1>
                <p style="color: #6b7280; font-size: 16px;">Thank you for signing up. Please use the following OTP to verify your email:</p>
            </div>
            
            <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
                <h1 style="color: #0ea5e9; font-size: 36px; margin: 0; letter-spacing: 5px;">{otp}</h1>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; margin-bottom: 10px;">This OTP will expire in 10 minutes.</p>
                <p style="color: #9ca3af; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
            </div>
        </body>
        </html>
        """
        
        if send_email(email, subject, body):
            return jsonify({
                'success': True,
                'message': 'Account created! Please check your email for OTP verification.',
                'user_id': str(result.inserted_id)
            })
        else:
            mongo.db.users.delete_one({'_id': result.inserted_id})
            return jsonify({'success': False, 'message': 'Failed to send verification email'})
            
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        otp = data.get('otp')
        
        if not user_id or not otp:
            return jsonify({'success': False, 'message': 'User ID and OTP required'})
        
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'})
        
        if user.get('email_verified'):
            return jsonify({'success': False, 'message': 'Email already verified'})
        
        if user.get('otp') != otp:
            return jsonify({'success': False, 'message': 'Invalid OTP'})
        
        if datetime.utcnow() > user.get('otp_expiry'):
            return jsonify({'success': False, 'message': 'OTP expired'})
        
        # Verify user
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {'email_verified': True, 'verified_at': datetime.utcnow()},
                '$unset': {'otp': '', 'otp_expiry': ''}
            }
        )
        
        # Send welcome email
        subject = "Welcome to NutriBaba!"
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #0ea5e9; margin-bottom: 20px;">Welcome to NutriBaba, {user['firstName']}!</h2>
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
                    Your account has been successfully verified. You can now log in and start your personalized nutrition journey with us.
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5000')}/login" 
                   style="background: linear-gradient(135deg, #0ea5e9, #0284c7); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600;
                          display: inline-block;">
                    Login Now
                </a>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 14px; text-align: center;">
                    Get ready to track your nutrition, reach your goals, and live healthier!
                </p>
            </div>
        </body>
        </html>
        """
        
        send_email(user['email'], subject, body)
        
        return jsonify({'success': True, 'message': 'Email verified successfully!'})
        
    except Exception as e:
        print(f"OTP verification error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/api/resend-otp', methods=['POST'])
def resend_otp():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'})
        
        if user.get('email_verified'):
            return jsonify({'success': False, 'message': 'Email already verified'})
        
        # Generate new OTP
        otp = generate_otp()
        otp_expiry = datetime.utcnow() + timedelta(minutes=10)
        
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'otp': otp, 'otp_expiry': otp_expiry}}
        )
        
        # Send OTP email
        subject = "New OTP for NutriBaba Account Verification"
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #0ea5e9;">New OTP for NutriBaba</h2>
                <p style="color: #6b7280; font-size: 16px;">Here's your new verification code:</p>
            </div>
            
            <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
                <h1 style="color: #0ea5e9; font-size: 36px; margin: 0; letter-spacing: 5px;">{otp}</h1>
            </div>
            
            <p style="color: #6b7280; text-align: center;">This OTP will expire in 10 minutes.</p>
        </body>
        </html>
        """
        
        if send_email(user['email'], subject, body):
            return jsonify({'success': True, 'message': 'New OTP sent to your email'})
        else:
            return jsonify({'success': False, 'message': 'Failed to send OTP'})
            
    except Exception as e:
        print(f"Resend OTP error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/api/get-profile', methods=['GET'])
@login_required
def get_profile():
    """Get user profile data for display or editing"""
    try:
        user = get_user_data(session['user_id'])
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'})
        
        if not user.get('profile_complete'):
            return jsonify({'success': False, 'message': 'Profile not completed'})
        
        # Prepare profile data (exclude sensitive information)
        profile_data = {
            'firstName': user.get('firstName', ''),
            'lastName': user.get('lastName', ''),
            'email': user.get('email', ''),
            'phone': user.get('phone', ''),
            'age': user.get('age'),
            'gender': user.get('gender', ''),
            'height': user.get('height'),
            'weight': user.get('weight'),
            'targetWeight': user.get('targetWeight'),
            'activityLevel': user.get('activityLevel', ''),
            'bmi': user.get('bmi'),
            'healthConditions': user.get('healthConditions', []),
            'medications': user.get('medications', ''),
            'dietType': user.get('dietType', ''),
            'mealsPerDay': user.get('mealsPerDay', ''),
            'allergies': user.get('allergies', []),
            'foodDislikes': user.get('foodDislikes', ''),
            'primaryGoal': user.get('primaryGoal', ''),
            'waterIntake': user.get('waterIntake', ''),
            'sleepHours': user.get('sleepHours', ''),
            'stressLevel': user.get('stressLevel', ''),
            'daily_calories': user.get('daily_calories')
        }
        
        return jsonify({'success': True, 'profile': profile_data})
        
    except Exception as e:
        print(f"Get profile error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/api/complete-profile', methods=['POST'])
@login_required
def complete_profile():
    """Complete user profile for the first time"""
    try:
        data = request.get_json()
        
        # Required fields validation
        required_fields = ['firstName', 'lastName', 'email', 'age', 'gender', 
                          'height', 'weight', 'activityLevel', 'dietType', 'primaryGoal']
        
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return jsonify({'success': False, 'message': f'{field.replace("_", " ").title()} is required'})
        
        # Validate allergies selection
        if not data.get('allergies') or len(data['allergies']) == 0:
            return jsonify({'success': False, 'message': 'Please select at least one option for food allergies'})
        
        user_id = ObjectId(session['user_id'])
        
        # Check if profile already exists
        existing_user = get_user_data(session['user_id'])
        if existing_user and existing_user.get('profile_complete'):
            return jsonify({'success': False, 'message': 'Profile already completed. Use update instead.'})
        
        # Prepare and validate profile data
        profile_data, error = prepare_profile_data(data, user_id)
        if error:
            return jsonify({'success': False, 'message': error})
        
        # Update user profile
        result = mongo.db.users.update_one(
            {'_id': user_id},
            {'$set': profile_data}
        )
        
        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Profile completed successfully!'})
        else:
            return jsonify({'success': False, 'message': 'Failed to update profile'})
            
    except Exception as e:
        print(f"Profile completion error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/api/update-profile', methods=['POST'])
@login_required
def update_profile():
    """Update existing user profile"""
    try:
        data = request.get_json()
        
        # Required fields validation
        required_fields = ['firstName', 'lastName', 'email', 'age', 'gender', 
                          'height', 'weight', 'activityLevel', 'dietType', 'primaryGoal']
        
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return jsonify({'success': False, 'message': f'{field.replace("_", " ").title()} is required'})
        
        # Validate allergies selection
        if not data.get('allergies') or len(data['allergies']) == 0:
            return jsonify({'success': False, 'message': 'Please select at least one option for food allergies'})
        
        user_id = ObjectId(session['user_id'])
        
        # Check if user exists and has a profile
        existing_user = get_user_data(session['user_id'])
        if not existing_user:
            return jsonify({'success': False, 'message': 'User not found'})
        
        if not existing_user.get('profile_complete'):
            return jsonify({'success': False, 'message': 'No existing profile to update. Please complete profile first.'})
        
        # Prepare and validate profile data
        profile_data, error = prepare_profile_data(data, user_id)
        if error:
            return jsonify({'success': False, 'message': error})
        
        # Add update timestamp
        profile_data['profile_updated_at'] = datetime.utcnow()
        
        # Update user profile
        result = mongo.db.users.update_one(
            {'_id': user_id},
            {'$set': profile_data}
        )
        
        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Profile updated successfully!'})
        else:
            return jsonify({'success': False, 'message': 'No changes made to profile'})
            
    except Exception as e:
        print(f"Profile update error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/profile')
@login_required
def profile():
    try:
        user = get_user_data(session['user_id'])
        return render_template('profile.html', user=user)
    except Exception as e:
        print(f"Profile page error: {e}")
        return render_template('profile.html', user=None)

@app.route('/dashboard')
@login_required
def dashboard():
    try:
        user = get_user_data(session['user_id'])
        if not user or not user.get('profile_complete'):
            return redirect(url_for('profile'))
        
        # Calculate user stats
        stats = {
            'daily_calories': user.get('daily_calories', 0),
            'bmi': user.get('bmi', 0),
            'days_since_signup': (datetime.utcnow() - user.get('created_at', datetime.utcnow())).days,
            'profile_completion': 100 if user.get('profile_complete') else 50
        }
        
        return render_template('dashboard.html', user=user, stats=stats)
    except Exception as e:
        print(f"Dashboard error: {e}")
        return render_template('dashboard.html', user=None, stats={})

@app.route('/query')
@login_required
def query():
    """AI Query page for nutrition questions"""
    try:
        user = get_user_data(session['user_id'])
        if not user or not user.get('profile_complete'):
            return redirect(url_for('profile'))
        return render_template('query.html', user=user)
    except Exception as e:
        print(f"Query page error: {e}")
        return render_template('query.html', user=None)

@app.route('/scanfood')
@login_required
def scanfood():
    """Food scanning page"""
    try:
        user = get_user_data(session['user_id'])
        if not user or not user.get('profile_complete'):
            return redirect(url_for('profile'))
        return render_template('scanfood.html', user=user)
    except Exception as e:
        print(f"Scan food page error: {e}")
        return render_template('scanfood.html', user=None)

@app.route('/foodtimeline')
@login_required
def foodtimeline():
    """Food timeline/tracking page"""
    try:
        user = get_user_data(session['user_id'])
        if not user or not user.get('profile_complete'):
            return redirect(url_for('profile'))
        return render_template('foodtimeline.html', user=user)
    except Exception as e:
        print(f"Food timeline page error: {e}")
        return render_template('foodtimeline.html', user=None)

@app.route('/api/user-data')
@login_required
def get_user_data_api():
    try:
        user = get_user_data(session['user_id'])
        if not user:
            return jsonify({'success': False, 'message': 'User not found'})
        
        # Remove sensitive data
        user_data = {
            'firstName': user.get('firstName', ''),
            'lastName': user.get('lastName', ''),
            'email': user.get('email', ''),
            'profile_complete': user.get('profile_complete', False),
            'bmi': user.get('bmi', 0),
            'daily_calories': user.get('daily_calories', 0),
            'primaryGoal': user.get('primaryGoal', ''),
            'activityLevel': user.get('activityLevel', '')
        }
        
        return jsonify({'success': True, 'user': user_data})
    except Exception as e:
        print(f"User data API error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Page not found',
        'message': 'The requested page could not be found.',
        'status_code': 404
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal server error',
        'message': 'An internal server error occurred.',
        'status_code': 500
    }), 500

@app.errorhandler(403)
def forbidden_error(error):
    """Handle 403 errors"""
    return jsonify({
        'error': 'Forbidden',
        'message': 'You do not have permission to access this resource.',
        'status_code': 403
    }), 403

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

# API endpoints for food queries (placeholder for future implementation)
@app.route('/api/query-nutrition', methods=['POST'])
@login_required
def query_nutrition():
    """Handle nutrition queries"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'success': False, 'message': 'Query is required'})
        
        # Placeholder response - implement actual AI/nutrition logic here
        response = {
            'success': True,
            'message': 'Query processed successfully',
            'response': f"This is a placeholder response for: {query}. Implement actual nutrition AI logic here.",
            'suggestions': [
                'Eat more fruits and vegetables',
                'Stay hydrated',
                'Balance your macronutrients'
            ]
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Query nutrition error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

@app.route('/api/scan-food', methods=['POST'])
@login_required
def scan_food():
    """Handle food scanning"""
    try:
        # Placeholder for food scanning logic
        # In a real implementation, you would process the uploaded image
        
        data = request.get_json()
        
        response = {
            'success': True,
            'message': 'Food scan completed',
            'food_info': {
                'name': 'Sample Food',
                'calories': 150,
                'protein': 10,
                'carbs': 20,
                'fat': 5,
                'fiber': 3
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Scan food error: {e}")
        return jsonify({'success': False, 'message': 'Server error occurred'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
