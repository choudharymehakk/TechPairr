from flask import Blueprint, request, jsonify, current_app
from app.utils.auth import require_auth
import uuid

bp = Blueprint('projects', __name__)

@bp.route('/', methods=['GET'])
def get_projects():
    """Get list of all open projects"""
    try:
        result = current_app.supabase.table('projects').select('*').filter(
            'status', 'eq', 'open'
        ).execute()
        
        return jsonify({
            'projects': result.data,
            'total_count': len(result.data)
        }), 200
        
    except Exception as e:
        print(f"Error in get_projects: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/create', methods=['POST'])
@require_auth
def create_project():
    """Create a new project"""
    try:
        data = request.get_json()
        user_id = request.user_id
        user_type = request.user_type
        
        # Validate required fields
        required_fields = ['title', 'description', 'project_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate project_type
        valid_types = ['research', 'product', 'startup', 'industry_problem']
        if data['project_type'] not in valid_types:
            return jsonify({'error': 'Invalid project_type. Must be one of: ' + ', '.join(valid_types)}), 400
        
        # Build project data
        project_data = {
            'title': data['title'],
            'description': data['description'],
            'creator_id': user_id,
            'creator_type': user_type,
            'project_type': data['project_type'],
            'status': 'open',
            
            # Optional fields with defaults
            'skills_required': data.get('skills_required', []),
            'skills_offered': data.get('skills_offered', []),
            'resources_needed': data.get('resources_needed', []),
            'resources_available': data.get('resources_available', []),
            'domain_areas': data.get('domain_areas', []),
            
            'duration_months': data.get('duration_months', 6),
            'time_commitment_hours': data.get('time_commitment_hours', 10),
            'max_collaborators': data.get('max_collaborators', 5),
            'current_collaborators': 0,
            
            'seeking_mentor_types': data.get('seeking_mentor_types', ['academic', 'industry']),
            'mentorship_level': data.get('mentorship_level', 'moderate')
        }
        
        # Insert project into database
        result = current_app.supabase.table('projects').insert(project_data).execute()
        
        if result.data:
            project = result.data[0]
            return jsonify({
                'message': 'Project created successfully',
                'project': project
            }), 201
        else:
            return jsonify({'error': 'Failed to create project'}), 500
            
    except Exception as e:
        print(f"Error in create_project: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/my-projects', methods=['GET'])
@require_auth
def get_my_projects():
    """Get current user's projects"""
    try:
        user_id = request.user_id
        
        result = current_app.supabase.table('projects').select('*').filter(
            'creator_id', 'eq', user_id
        ).execute()
        
        return jsonify({
            'projects': result.data,
            'total_count': len(result.data)
        }), 200
        
    except Exception as e:
        print(f"Error in get_my_projects: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/<project_id>', methods=['GET'])
def get_project_details():
    """Get detailed information about a specific project"""
    try:
        project_id = request.view_args['project_id']
        
        # Get project data
        result = current_app.supabase.table('projects').select('*').filter(
            'id', 'eq', project_id
        ).execute()
        
        if not result.data:
            return jsonify({'error': 'Project not found'}), 404
        
        project = result.data[0]
        
        # Get creator information
        creator_result = current_app.supabase.table('users').select(
            'id, email, user_type, profile_data'
        ).filter('id', 'eq', project['creator_id']).execute()
        
        creator_info = None
        if creator_result.data:
            creator = creator_result.data[0]
            creator_info = {
                'id': creator['id'],
                'name': creator['profile_data'].get('name', 'Unknown'),
                'user_type': creator['user_type'],
                'email': creator['email']
            }
        
        # Build response
        project_details = {
            'project': project,
            'creator': creator_info
        }
        
        return jsonify(project_details), 200
        
    except Exception as e:
        print(f"Error in get_project_details: {str(e)}")
        return jsonify({'error': str(e)}), 500
