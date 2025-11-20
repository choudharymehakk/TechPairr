from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY
import jwt
import bcrypt
from datetime import datetime, timedelta
import os 

app = Flask(__name__)

CORS(app, origins=[
    'https://mentora-h34f.onrender.com', 
    'http://localhost:5173'
])


# Production config
supabase = create_client(
    os.environ.get('SUPABASE_URL', SUPABASE_URL),
    os.environ.get('SUPABASE_KEY', SUPABASE_KEY)
)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'service': 'Mentora API'})


@app.route('/api/test-db', methods=['GET'])
def test_database():
    try:
        result = supabase.table('users').select('*').limit(1).execute()
        return jsonify({
            'status': 'success',
            'message': 'Database connection successful',
            'data': result.data
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        user_type = data.get('user_type')  # student, faculty, industry
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insert user
        result = supabase.table('users').insert({
            'email': email,
            'password_hash': password_hash,
            'full_name': full_name,
            'user_type': user_type
        }).execute()
        
        user_id = result.data[0]['id']
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'user_type': user_type,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, app.config.get('JWT_SECRET', 'your-secret'), algorithm='HS256')
        
        return jsonify({
            'status': 'success',
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': user_id,
                'email': email,
                'full_name': full_name,
                'user_type': user_type
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Get user from database
        result = supabase.table('users').select('*').eq('email', email).execute()
        
        if not result.data:
            return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401
        
        user = result.data[0]
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'user_type': user['user_type'],
            'exp': datetime.utcnow() + timedelta(days=7)
        }, app.config.get('JWT_SECRET', 'your-secret'), algorithm='HS256')
        
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'user_type': user['user_type']
            }
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


# ============================================
# PROFILE ENDPOINTS
# ============================================

@app.route('/api/profile/student', methods=['POST'])
def create_student_profile():
    try:
        data = request.json
        user_id = data.get('user_id')
        
        profile_data = {
            'user_id': user_id,
            'student_id': data.get('student_id'),
            'department': data.get('department'),
            'year_of_study': data.get('year_of_study'),
            'cgpa': data.get('cgpa'),
            'skills': data.get('skills', []),
            'interests': data.get('interests', []),
            'career_goals': data.get('career_goals', []),
            'portfolio_url': data.get('portfolio_url'),
            'github_url': data.get('github_url'),
            'bio': data.get('bio'),
            'collaboration_preference': data.get('collaboration_preference'),
            'time_commitment': data.get('time_commitment')
        }
        
        result = supabase.table('student_profiles').insert(profile_data).execute()
        
        return jsonify({
            'status': 'success',
            'message': 'Student profile created successfully',
            'data': result.data[0]
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/profile/faculty', methods=['POST'])
def create_faculty_profile():
    try:
        data = request.json
        user_id = data.get('user_id')
        
        profile_data = {
            'user_id': user_id,
            'employee_id': data.get('employee_id'),
            'department': data.get('department'),
            'designation': data.get('designation'),
            'research_areas': data.get('research_areas', []),
            'expertise': data.get('expertise', []),
            'mentoring_capacity': data.get('mentoring_capacity', 3),
            'mentoring_style': data.get('mentoring_style'),
            'available_resources': data.get('available_resources', []),
            'lab_access': data.get('lab_access', False),
            'funding_available': data.get('funding_available', False),
            'open_to_student_ideas': data.get('open_to_student_ideas', True),
            'bio': data.get('bio'),
            'google_scholar': data.get('google_scholar')
        }
        
        result = supabase.table('faculty_profiles').insert(profile_data).execute()
        
        return jsonify({
            'status': 'success',
            'message': 'Faculty profile created successfully',
            'data': result.data[0]
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/profile/industry', methods=['POST'])
def create_industry_profile():
    try:
        data = request.json
        user_id = data.get('user_id')
        
        profile_data = {
            'user_id': user_id,
            'company': data.get('company'),
            'position': data.get('position'),
            'industry_domain': data.get('industry_domain'),
            'expertise': data.get('expertise', []),
            'years_experience': data.get('years_experience'),
            'mentoring_capacity': data.get('mentoring_capacity', 8),
            'available_time': data.get('available_time'),
            'mentoring_focus': data.get('mentoring_focus', []),
            'linkedin_profile': data.get('linkedin_profile'),
            'company_website': data.get('company_website'),
            'willing_to_provide': data.get('willing_to_provide', []),
            'bio': data.get('bio')
        }
        
        result = supabase.table('industry_profiles').insert(profile_data).execute()
        
        return jsonify({
            'status': 'success',
            'message': 'Industry profile created successfully',
            'data': result.data[0]
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/profile/<user_type>/<user_id>', methods=['GET'])
def get_profile(user_type, user_id):
    try:
        table_name = f"{user_type}_profiles"
        result = supabase.table(table_name).select('*').eq('user_id', user_id).execute()
        
        if result.data:
            return jsonify({
                'status': 'success',
                'data': result.data[0]
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Profile not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


# ============================================
# PROJECT ENDPOINTS
# ============================================

@app.route('/api/projects', methods=['POST'])
def create_project():
    try:
        data = request.json
        print("Received project data:", data)
        
        project_data = {
            'title': data.get('title'),
            'description': data.get('description'),
            'creator_id': data.get('creator_id'),
            'creator_type': data.get('creator_type'),
            'project_type': data.get('project_type'),
            'required_skills': data.get('required_skills', []),
            'required_expertise': data.get('required_expertise', []),
            'student_count_needed': data.get('student_count_needed', 1),
            'duration': data.get('duration'),
            'time_commitment_hours': data.get('time_commitment_hours'),
            'start_date': data.get('start_date'),
            'goals': data.get('goals'),
            'deliverables': data.get('deliverables'),
            'resources_available': data.get('resources_available', []),
            'domain': data.get('domain'),
            'status': 'open'
        }
        
        print("Prepared project data:", project_data)
        
        result = supabase.table('projects').insert(project_data).execute()
        
        print("Insert result:", result)
        
        return jsonify({
            'status': 'success',
            'message': 'Project created successfully',
            'data': result.data[0]
        }), 201
        
    except Exception as e:
        print("Error creating project:", str(e))
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        creator_type = request.args.get('creator_type')
        status = request.args.get('status')
        domain = request.args.get('domain')
        
        query = supabase.table('projects').select('*')
        
        if creator_type:
            query = query.eq('creator_type', creator_type)
        if status:
            query = query.eq('status', status)
        if domain:
            query = query.eq('domain', domain)
            
        result = query.order('created_at', desc=True).execute()
        
        return jsonify({
            'status': 'success',
            'data': result.data
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    try:
        result = supabase.table('projects').select('*').eq('id', project_id).execute()
        
        if result.data:
            return jsonify({
                'status': 'success',
                'data': result.data[0]
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Project not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/projects/user/<user_id>', methods=['GET'])
def get_user_projects(user_id):
    try:
        result = supabase.table('projects').select('*').eq('creator_id', user_id).order('created_at', desc=True).execute()
        
        return jsonify({
            'status': 'success',
            'data': result.data
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/projects/<project_id>/owner', methods=['GET'])
def get_project_owner(project_id):
    try:
        project = supabase.table('projects').select('creator_id, creator_type').eq('id', project_id).execute()
        
        if not project.data:
            return jsonify({'status': 'error', 'message': 'Project not found'}), 404
        
        creator_id = project.data[0]['creator_id']
        creator_type = project.data[0]['creator_type']
        
        user = supabase.table('users').select('full_name, email, user_type').eq('id', creator_id).execute()
        
        profile = None
        if creator_type == 'student':
            profile = supabase.table('student_profiles').select('*').eq('user_id', creator_id).execute()
        elif creator_type == 'faculty':
            profile = supabase.table('faculty_profiles').select('*').eq('user_id', creator_id).execute()
        elif creator_type == 'industry':
            profile = supabase.table('industry_profiles').select('*').eq('user_id', creator_id).execute()
        
        return jsonify({
            'status': 'success',
            'data': {
                'user': user.data[0] if user.data else None,
                'profile': profile.data[0] if profile and profile.data else None
            }
        })
        
    except Exception as e:
        print("Error fetching project owner:", str(e))
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/projects/<project_id>', methods=['PUT'])
def update_project(project_id):
    try:
        data = request.json
        print("Updating project:", project_id, data)
        
        update_data = {}
        allowed_fields = ['title', 'description', 'required_skills', 'required_expertise', 
                         'student_count_needed', 'duration', 'time_commitment_hours', 
                         'start_date', 'goals', 'deliverables', 'resources_available', 
                         'domain', 'status']
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        update_data['updated_at'] = 'now()'
        
        result = supabase.table('projects').update(update_data).eq('id', project_id).execute()
        
        return jsonify({
            'status': 'success',
            'message': 'Project updated successfully',
            'data': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print("Error updating project:", str(e))
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        print("Deleting project:", project_id)
        
        result = supabase.table('projects').delete().eq('id', project_id).execute()
        
        return jsonify({
            'status': 'success',
            'message': 'Project deleted successfully'
        })
        
    except Exception as e:
        print("Error deleting project:", str(e))
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/projects/<project_id>/stats', methods=['GET'])
def get_project_stats(project_id):
    try:
        applications = supabase.table('applications').select('status').eq('project_id', project_id).execute()
        
        stats = {
            'total': len(applications.data),
            'pending': len([a for a in applications.data if a['status'] == 'pending']),
            'accepted': len([a for a in applications.data if a['status'] == 'accepted']),
            'rejected': len([a for a in applications.data if a['status'] == 'rejected'])
        }
        
        return jsonify({
            'status': 'success',
            'data': stats
        })
        
    except Exception as e:
        print("Error fetching project stats:", str(e))
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


# ============================================
# APPLICATION ENDPOINTS
# ============================================

@app.route('/api/applications', methods=['POST'])
def create_application():
    try:
        data = request.json
        print("Received application data:", data) 
        
        application_data = {
            'project_id': data.get('project_id'),
            'applicant_id': data.get('applicant_id'),
            'applicant_type': data.get('applicant_type'),
            'application_type': data.get('application_type'),
            'cover_letter': data.get('cover_letter'),
            'relevant_experience': data.get('relevant_experience'),
            'availability': data.get('availability'),
            'status': 'pending'
        }
        
        print("Prepared application data:", application_data)
        
        result = supabase.table('applications').insert(application_data).execute()
        
        print("Insert result:", result) 
        
        return jsonify({
            'status': 'success',
            'message': 'Application submitted successfully',
            'data': result.data[0]
        }), 201
        
    except Exception as e:
        print("Error creating application:", str(e))  
        import traceback
        traceback.print_exc()  
        
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/applications/user/<user_id>', methods=['GET'])
def get_user_applications(user_id):
    try:
        result = supabase.table('applications').select('*').eq('applicant_id', user_id).order('applied_at', desc=True).execute()
        
        return jsonify({
            'status': 'success',
            'data': result.data
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/applications/project/<project_id>', methods=['GET'])
def get_project_applications(project_id):
    try:
        applications = supabase.table('applications').select('*').eq('project_id', project_id).order('applied_at', desc=True).execute()
        
        applications_with_users = []
        for app in applications.data:
            applicant_id = app['applicant_id']
            applicant_type = app['applicant_type']
            
            user = supabase.table('users').select('full_name, email, user_type').eq('id', applicant_id).execute()
            
            profile = None
            if applicant_type == 'student':
                profile = supabase.table('student_profiles').select('*').eq('user_id', applicant_id).execute()
            elif applicant_type == 'faculty':
                profile = supabase.table('faculty_profiles').select('*').eq('user_id', applicant_id).execute()
            elif applicant_type == 'industry':
                profile = supabase.table('industry_profiles').select('*').eq('user_id', applicant_id).execute()
            
            app_data = {
                **app,
                'applicant': user.data[0] if user.data else None,
                'applicant_profile': profile.data[0] if profile and profile.data else None
            }
            applications_with_users.append(app_data)
        
        return jsonify({
            'status': 'success',
            'data': applications_with_users
        })
        
    except Exception as e:
        print("Error fetching project applications:", str(e))
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/applications/<application_id>/status', methods=['PUT'])
def update_application_status(application_id):
    try:
        data = request.json
        status = data.get('status')
        
        result = supabase.table('applications').update({'status': status}).eq('id', application_id).execute()
        
        return jsonify({
            'status': 'success',
            'message': f'Application {status}',
            'data': result.data[0]
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


@app.route('/api/applications/check/<project_id>/<user_id>', methods=['GET'])
def check_existing_application(project_id, user_id):
    try:
        existing = supabase.table('applications').select('*').eq('project_id', project_id).eq('applicant_id', user_id).execute()
        
        if existing.data and len(existing.data) > 0:
            return jsonify({
                'status': 'success',
                'exists': True,
                'application': existing.data[0]
            })
        else:
            return jsonify({
                'status': 'success',
                'exists': False,
                'application': None
            })
        
    except Exception as e:
        print("Error checking application:", str(e))
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400


if __name__ == '__main__':
   
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
