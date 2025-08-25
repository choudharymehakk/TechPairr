from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from supabase import create_client, Client

def create_app():
    app = Flask(__name__)
    
    # Load environment variables
    load_dotenv()
    
    # Configure Flask
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    
    # ✅ PROPER CORS CONFIGURATION - This fixes your CORS issues
    CORS(app, 
         origins=['http://localhost:5173', 'http://127.0.0.1:5173'],  # React Vite port
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True,
         expose_headers=['Content-Type', 'Authorization']
    )
    
    # Initialize Supabase
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Missing Supabase configuration. Check your .env file.")
    
    app.supabase = create_client(supabase_url, supabase_key)
    print("✅ Supabase connection established")
    
    # Register blueprints
    from app.routes.auth import bp as auth_bp
    from app.routes.users import bp as users_bp
    from app.routes.projects import bp as projects_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        try:
            # Test database connection
            result = app.supabase.table('users').select('count').execute()
            return {
                'status': 'healthy', 
                'database': 'connected',
                'message': 'Mentora API is running'
            }
        except Exception as e:
            return {
                'status': 'unhealthy', 
                'database': 'disconnected',
                'error': str(e)
            }, 500
    
    # Root endpoint
    @app.route('/')
    def home():
        return {
            'message': 'Mentora API is running',
            'version': '1.0',
            'endpoints': {
                'health': '/health',
                'auth': '/api/auth',
                'users': '/api/users', 
                'projects': '/api/projects'
            }
        }
    
    return app
