from flask import Blueprint, request, jsonify, current_app
import bcrypt
from app.utils.auth import generate_token

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    """Register a new user (student, faculty, or industry mentor)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'user_type', 'name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        email = data['email']
        password = data['password']
        user_type = data['user_type']
        name = data['name']
        
        # Validate user type
        if user_type not in ['student', 'faculty', 'industry']:
            return jsonify({'error': 'Invalid user type'}), 400
        
        # Check if user already exists
        existing_user = current_app.supabase.table('users').select('email').filter(
            'email', 'eq', email
        ).execute()
        
        if existing_user.data:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create profile data structure
        profile_data = {'name': name}
        
        # Add user type specific fields
        if user_type == 'student':
            profile_data.update({
                'skills': data.get('skills', []),
                'interests': data.get('interests', []),
                'year': data.get('year', ''),
                'major': data.get('major', '')
            })
        elif user_type == 'faculty':
            profile_data.update({
                'department': data.get('department', ''),
                'research_areas': data.get('research_areas', []),
                'expertise': data.get('expertise', [])
            })
        elif user_type == 'industry':
            profile_data.update({
                'company': data.get('company', ''),
                'position': data.get('position', ''),
                'technical_expertise': data.get('technical_expertise', []),
                'experience_years': data.get('experience_years', 0)
            })
        
        # Insert user into database
        result = current_app.supabase.table('users').insert({
            'email': email,
            'password_hash': password_hash,
            'user_type': user_type,
            'profile_data': profile_data
        }).execute()
        
        if result.data:
            user = result.data[0]
            
            # Create mentor capacity record for faculty and industry users
            if user_type in ['faculty', 'industry']:
                capacity_data = {
                    'mentor_id': user['id'],
                    'max_capacity': 4 if user_type == 'faculty' else 6,
                    'current_load': 0,
                    'mentor_type': 'academic' if user_type == 'faculty' else 'industry',
                    'mentorship_style': 'collaborative',
                    'accepts_new_students': True
                }
                
                current_app.supabase.table('mentor_capacity').insert(capacity_data).execute()
            
            # Generate token
            token = generate_token(user)
            
            return jsonify({
                'message': 'User registered successfully',
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'user_type': user['user_type'],
                    'profile_data': user['profile_data']
                }
            }), 201
            
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@bp.route('/login', methods=['POST'])
def login():
    """Login existing user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find user
        result = current_app.supabase.table('users').select('*').filter(
            'email', 'eq', email
        ).filter('is_active', 'eq', True).execute()
        
        if not result.data:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        user = result.data[0]
        
        # Verify password
        if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            token = generate_token(user)
            
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'user_type': user['user_type'],
                    'profile_data': user['profile_data']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500
