from functools import wraps
from flask import request, jsonify, current_app
import jwt

def require_auth(f):
    """Decorator to require authentication for protected routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Decode JWT token
            payload = jwt.decode(
                token, 
                current_app.config['SECRET_KEY'], 
                algorithms=['HS256']
            )
            
            # Add user info to request
            request.user_id = payload['user_id']
            request.user_email = payload['email']
            request.user_type = payload['user_type']
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def generate_token(user_data):
    """Generate JWT token for authenticated user"""
    import datetime
    
    payload = {
        'user_id': user_data['id'],
        'email': user_data['email'],
        'user_type': user_data['user_type'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
