from flask import Blueprint, request, jsonify, current_app
from app.utils.auth import require_auth

bp = Blueprint('users', __name__)

@bp.route('/profile', methods=['GET'])
@require_auth
def get_profile():
    """Get current user's profile"""
    try:
        user_id = request.user_id
        
        result = current_app.supabase.table('users').select('*').filter(
            'id', 'eq', user_id
        ).execute()
        
        if result.data:
            user = result.data[0]
            return jsonify({
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'user_type': user['user_type'],
                    'profile_data': user['profile_data'],
                    'created_at': user['created_at']
                }
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        print(f"Error in get_profile: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/mentors', methods=['GET'])
def get_available_mentors():
    """Get list of available mentors with proper error handling"""
    try:
        mentor_type = request.args.get('type')  # faculty or industry
        domain = request.args.get('domain')
        
        # Step 1: Get all users who are mentors (faculty or industry)
        users_result = current_app.supabase.table('users').select(
            'id, email, user_type, profile_data, created_at'
        ).or_('user_type.eq.faculty,user_type.eq.industry').execute()
        
        if not users_result.data:
            return jsonify({
                'available_mentors': [],
                'total_count': 0,
                'message': 'No mentors found'
            }), 200
        
        # Step 2: Get mentor capacity data separately
        mentor_ids = [user['id'] for user in users_result.data]
        capacity_result = current_app.supabase.table('mentor_capacity').select('*').filter(
            'mentor_id', 'in', f"({','.join(mentor_ids)})"
        ).execute()
        
        # Create a lookup dictionary for capacity data
        capacity_lookup = {}
        for capacity in capacity_result.data:
            capacity_lookup[capacity['mentor_id']] = capacity
        
        available_mentors = []
        
        for mentor in users_result.data:
            # Skip if specific mentor type requested and doesn't match
            if mentor_type and mentor['user_type'] != mentor_type:
                continue
            
            # Get capacity data for this mentor
            capacity = capacity_lookup.get(mentor['id'])
            
            if not capacity:
                # If no capacity record, skip this mentor
                continue
            
            # Check if mentor is accepting students and has available slots
            if (capacity['accepts_new_students'] and 
                capacity['current_load'] < capacity['max_capacity']):
                
                available_slots = capacity['max_capacity'] - capacity['current_load']
                
                # Domain filtering if specified
                if domain:
                    mentor_domains = []
                    if mentor['user_type'] == 'faculty':
                        research_areas = mentor['profile_data'].get('expertise', {}).get('research_areas', [])
                        mentor_domains.extend(research_areas)
                    elif mentor['user_type'] == 'industry':
                        tech_expertise = mentor['profile_data'].get('expertise', {}).get('technical_skills', [])
                        mentor_domains.extend(tech_expertise)
                    
                    # Skip if domain specified but no match found
                    if domain and not any(domain.lower() in str(d).lower() for d in mentor_domains):
                        continue
                
                # Build mentor response object
                mentor_data = {
                    'id': mentor['id'],
                    'name': mentor['profile_data'].get('name', 'Unknown'),
                    'user_type': mentor['user_type'],
                    'available_slots': available_slots,
                    'mentorship_style': capacity.get('mentorship_style', 'collaborative'),
                    'max_capacity': capacity['max_capacity'],
                    'current_load': capacity['current_load']
                }
                
                # Add type-specific information
                if mentor['user_type'] == 'faculty':
                    mentor_data.update({
                        'department': mentor['profile_data'].get('academic_info', {}).get('department', ''),
                        'research_areas': mentor['profile_data'].get('expertise', {}).get('research_areas', []),
                        'position': mentor['profile_data'].get('academic_info', {}).get('position', ''),
                        'experience_years': mentor['profile_data'].get('experience', {}).get('years_teaching', 0)
                    })
                elif mentor['user_type'] == 'industry':
                    mentor_data.update({
                        'company': mentor['profile_data'].get('professional_info', {}).get('company', ''),
                        'position': mentor['profile_data'].get('professional_info', {}).get('position', ''),
                        'technical_skills': mentor['profile_data'].get('expertise', {}).get('technical_skills', []),
                        'experience_years': mentor['profile_data'].get('experience', {}).get('total_years', 0),
                        'industry_domains': mentor['profile_data'].get('experience', {}).get('industry_domains', [])
                    })
                
                available_mentors.append(mentor_data)
        
        return jsonify({
            'available_mentors': available_mentors,
            'total_count': len(available_mentors),
            'filters_applied': {
                'mentor_type': mentor_type,
                'domain': domain
            }
        }), 200
        
    except Exception as e:
        print(f"Error in get_available_mentors: {str(e)}")
        return jsonify({
            'error': 'Failed to fetch mentors',
            'details': str(e)
        }), 500

@bp.route('/students', methods=['GET'])
@require_auth
def get_students():
    """Get list of students (for mentors to browse)"""
    try:
        # Only allow faculty and industry mentors to access this
        if request.user_type not in ['faculty', 'industry']:
            return jsonify({'error': 'Unauthorized - Only mentors can view student list'}), 403
        
        # Get query parameters
        skills_filter = request.args.get('skills')
        year_filter = request.args.get('year')
        major_filter = request.args.get('major')
        
        # Build base query
        query = current_app.supabase.table('users').select(
            'id, email, user_type, profile_data, created_at'
        ).filter('user_type', 'eq', 'student').filter('is_active', 'eq', True)
        
        result = query.execute()
        
        students = []
        for student in result.data:
            # Apply filters if specified
            if year_filter:
                student_year = student['profile_data'].get('academic_info', {}).get('year', '')
                if year_filter.lower() not in student_year.lower():
                    continue
            
            if major_filter:
                student_major = student['profile_data'].get('academic_info', {}).get('major', '')
                if major_filter.lower() not in student_major.lower():
                    continue
            
            if skills_filter:
                student_skills = student['profile_data'].get('skills', {}).get('technical', [])
                if not any(skills_filter.lower() in skill.lower() for skill in student_skills):
                    continue
            
            # Build student data object
            student_data = {
                'id': student['id'],
                'name': student['profile_data'].get('name', 'Unknown'),
                'email': student['email'],
                'academic_info': student['profile_data'].get('academic_info', {}),
                'skills': student['profile_data'].get('skills', {}),
                'interests': student['profile_data'].get('interests', []),
                'career_goals': student['profile_data'].get('career_goals', []),
                'availability': student['profile_data'].get('availability', {}),
                'created_at': student['created_at']
            }
            
            students.append(student_data)
        
        return jsonify({
            'students': students,
            'total_count': len(students),
            'filters_applied': {
                'skills': skills_filter,
                'year': year_filter,
                'major': major_filter
            }
        }), 200
        
    except Exception as e:
        print(f"Error in get_students: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile():
    """Update current user's profile"""
    try:
        user_id = request.user_id
        update_data = request.get_json()
        
        if not update_data:
            return jsonify({'error': 'No update data provided'}), 400
        
        # Get current profile
        current_result = current_app.supabase.table('users').select('profile_data').filter(
            'id', 'eq', user_id
        ).execute()
        
        if not current_result.data:
            return jsonify({'error': 'User not found'}), 404
        
        current_profile = current_result.data[0]['profile_data']
        
        # Merge update data with current profile (deep merge)
        def deep_merge(dict1, dict2):
            result = dict1.copy()
            for key, value in dict2.items():
                if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                    result[key] = deep_merge(result[key], value)
                else:
                    result[key] = value
            return result
        
        updated_profile = deep_merge(current_profile, update_data)
        
        # Update in database
        result = current_app.supabase.table('users').update({
            'profile_data': updated_profile,
            'updated_at': 'NOW()'
        }).filter('id', 'eq', user_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Profile updated successfully',
                'profile_data': updated_profile
            }), 200
        else:
            return jsonify({'error': 'Failed to update profile'}), 500
            
    except Exception as e:
        print(f"Error in update_profile: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/mentors/<mentor_id>', methods=['GET'])
def get_mentor_details():
    """Get detailed information about a specific mentor"""
    try:
        mentor_id = request.view_args['mentor_id']
        
        # Get mentor user data
        user_result = current_app.supabase.table('users').select('*').filter(
            'id', 'eq', mentor_id
        ).filter('user_type', 'in', '("faculty","industry")').execute()
        
        if not user_result.data:
            return jsonify({'error': 'Mentor not found'}), 404
        
        mentor = user_result.data[0]
        
        # Get mentor capacity data
        capacity_result = current_app.supabase.table('mentor_capacity').select('*').filter(
            'mentor_id', 'eq', mentor_id
        ).execute()
        
        capacity_data = capacity_result.data[0] if capacity_result.data else None
        
        # Build detailed mentor response
        mentor_details = {
            'id': mentor['id'],
            'name': mentor['profile_data'].get('name'),
            'email': mentor['email'],
            'user_type': mentor['user_type'],
            'profile_data': mentor['profile_data'],
            'capacity_info': capacity_data,
            'created_at': mentor['created_at']
        }
        
        return jsonify({'mentor': mentor_details}), 200
        
    except Exception as e:
        print(f"Error in get_mentor_details: {str(e)}")
        return jsonify({'error': str(e)}), 500
