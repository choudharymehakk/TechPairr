from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY
import jwt
import bcrypt
from datetime import datetime, timedelta
import os 

app = Flask(__name__)

# CORS configuration for production and development
CORS(app, resources={r"/*": {
    "origins": [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://mentora-khaki.vercel.app",
        "https://mentora1.vercel.app"
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

# Production config
supabase = create_client(
    os.environ.get('SUPABASE_URL', SUPABASE_URL),
    os.environ.get('SUPABASE_KEY', SUPABASE_KEY)
)


# ============================================
# MATCHING UTILITY FUNCTIONS
# ============================================

def calc_match_percent(set1, set2):
    """Calculate percentage match between two lists of strings"""
    set1 = set(s.lower().strip() for s in (set1 or []) if s)
    set2 = set(s.lower().strip() for s in (set2 or []) if s)
    if not set1 or not set2:
        return 0
    overlap = set1 & set2
    if not overlap:
        return 0
    score = round((len(overlap) / max(len(set1), len(set2))) * 100)
    return score


def student_to_faculty(student_profile, faculty_profile):
    """Calculate match score between student and faculty"""
    skills_score = calc_match_percent(
        student_profile.get('skills', []),
        faculty_profile.get('expertise', [])  # Using 'expertise' not 'technical_expertise'
    )
    interests_score = calc_match_percent(
        student_profile.get('interests', []),
        faculty_profile.get('research_areas', [])
    )
    
    why = []
    if skills_score > 0:
        overlap = set(student_profile.get('skills', [])) & set(faculty_profile.get('expertise', []))
        why.append(f"Skills: {', '.join(overlap)}")
    if interests_score > 0:
        overlap = set(student_profile.get('interests', [])) & set(faculty_profile.get('research_areas', []))
        why.append(f"Interests: {', '.join(overlap)}")
    
    match_score = round((skills_score + interests_score) / 2)
    return {"match": match_score, "why": why}

def student_to_industry(student_profile, industry_profile):
    """Calculate match score between student and industry mentor"""
    skills_score = calc_match_percent(
        student_profile.get('skills', []),
        industry_profile.get('expertise', [])
    )
    interests_score = calc_match_percent(
        student_profile.get('interests', []),
        industry_profile.get('mentoring_focus', [])
    )
    
    why = []
    if skills_score > 0:
        overlap = set(student_profile.get('skills', [])) & set(industry_profile.get('expertise', []))
        why.append(f"Skills: {', '.join(overlap)}")
    if interests_score > 0:
        overlap = set(student_profile.get('interests', [])) & set(industry_profile.get('mentoring_focus', []))
        why.append(f"Interests: {', '.join(overlap)}")
    
    match_score = round((skills_score + interests_score) / 2)
    return {"match": match_score, "why": why}

def student_to_project(student_profile, project):
    """Calculate match score between student and project"""
    skills_score = calc_match_percent(
        student_profile.get('skills', []),
        project.get('required_skills', [])
    )
    expertise_score = calc_match_percent(
        student_profile.get('interests', []),
        project.get('required_expertise', [])
    )
    
    why = []
    if skills_score > 0:
        overlap = set(student_profile.get('skills', [])) & set(project.get('required_skills', []))
        why.append(f"Skills: {', '.join(overlap)}")
    if expertise_score > 0:
        overlap = set(student_profile.get('interests', [])) & set(project.get('required_expertise', []))
        why.append(f"Interests: {', '.join(overlap)}")
    
    match_score = round((skills_score + expertise_score) / 2)
    return {"match": match_score, "why": why}

def faculty_to_student(faculty_profile, student_profile):
    """Calculate match score between faculty and student"""
    expertise_score = calc_match_percent(
        faculty_profile.get('expertise', []),
        student_profile.get('skills', [])
    )
    research_score = calc_match_percent(
        faculty_profile.get('research_areas', []),
        student_profile.get('interests', [])
    )
    
    why = []
    if expertise_score > 0:
        overlap = set(faculty_profile.get('expertise', [])) & set(student_profile.get('skills', []))
        why.append(f"Skills match: {', '.join(overlap)}")
    if research_score > 0:
        overlap = set(faculty_profile.get('research_areas', [])) & set(student_profile.get('interests', []))
        why.append(f"Interest match: {', '.join(overlap)}")
    
    match_score = round((expertise_score + research_score) / 2)
    return {"match": match_score, "why": why}


def faculty_to_project(faculty_profile, project):
    """Calculate match score between faculty and student project"""
    expertise_score = calc_match_percent(
        faculty_profile.get('expertise', []),
        project.get('required_skills', [])
    )
    research_score = calc_match_percent(
        faculty_profile.get('research_areas', []),
        project.get('required_expertise', [])
    )
    
    why = []
    if expertise_score > 0:
        overlap = set(faculty_profile.get('expertise', [])) & set(project.get('required_skills', []))
        why.append(f"Skills: {', '.join(overlap)}")
    if research_score > 0:
        overlap = set(faculty_profile.get('research_areas', [])) & set(project.get('required_expertise', []))
        why.append(f"Expertise: {', '.join(overlap)}")
    
    match_score = round((expertise_score + research_score) / 2)
    return {"match": match_score, "why": why}

def industry_to_student(industry_profile, student_profile):
    """Calculate match score between industry mentor and student"""
    expertise_score = calc_match_percent(
        industry_profile.get('expertise', []),
        student_profile.get('skills', [])
    )
    focus_score = calc_match_percent(
        industry_profile.get('mentoring_focus', []),
        student_profile.get('interests', [])
    )
    
    why = []
    if expertise_score > 0:
        overlap = set(industry_profile.get('expertise', [])) & set(student_profile.get('skills', []))
        why.append(f"Skills match: {', '.join(overlap)}")
    if focus_score > 0:
        overlap = set(industry_profile.get('mentoring_focus', [])) & set(student_profile.get('interests', []))
        why.append(f"Interest match: {', '.join(overlap)}")
    
    match_score = round((expertise_score + focus_score) / 2)
    return {"match": match_score, "why": why}


def industry_to_project(industry_profile, project):
    """Calculate match score between industry mentor and student project"""
    expertise_score = calc_match_percent(
        industry_profile.get('expertise', []),
        project.get('required_skills', [])
    )
    focus_score = calc_match_percent(
        industry_profile.get('mentoring_focus', []),
        project.get('required_expertise', [])
    )
    
    why = []
    if expertise_score > 0:
        overlap = set(industry_profile.get('expertise', [])) & set(project.get('required_skills', []))
        why.append(f"Skills: {', '.join(overlap)}")
    if focus_score > 0:
        overlap = set(industry_profile.get('mentoring_focus', [])) & set(project.get('required_expertise', []))
        why.append(f"Expertise: {', '.join(overlap)}")
    
    match_score = round((expertise_score + focus_score) / 2)
    return {"match": match_score, "why": why}


# ============================================
# HEALTH & TEST ENDPOINTS
# ============================================

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


# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

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
# EXPLORE / MATCHING ENDPOINT
# ============================================

@app.route('/api/explore', methods=['GET'])
def explore():
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"status": "error", "message": "Missing user_id parameter"}), 400

        # Get user info
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        if not user_result.data:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        user = user_result.data[0]
        user_type = user["user_type"]

        # Get user's profile
        profile_result = supabase.table(f"{user_type}_profiles").select('*').eq('user_id', user_id).execute()
        if not profile_result.data:
            return jsonify({"status": "error", "message": "Profile not found"}), 404
        
        profile = profile_result.data[0]
        results = []

        # STUDENT MATCHING: Show faculty, industry mentors, AND projects
        if user_type == "student":
            # Match with Faculty
            faculty_profiles = supabase.table("faculty_profiles").select('*').execute().data or []
            for faculty in faculty_profiles:
                match = student_to_faculty(profile, faculty)
                if match["match"] > 0:
                    faculty_user = supabase.table('users').select('full_name, email').eq('id', faculty['user_id']).execute()
                    results.append({
                        "type": "faculty",
                        "profile": faculty,
                        "user": faculty_user.data[0] if faculty_user.data else None,
                        "match": match["match"],
                        "why": match["why"]
                    })
            
            # Match with Industry Mentors
            industry_profiles = supabase.table("industry_profiles").select('*').execute().data or []
            for industry in industry_profiles:
                match = student_to_industry(profile, industry)
                if match["match"] > 0:
                    industry_user = supabase.table('users').select('full_name, email').eq('id', industry['user_id']).execute()
                    results.append({
                        "type": "industry",
                        "profile": industry,
                        "user": industry_user.data[0] if industry_user.data else None,
                        "match": match["match"],
                        "why": match["why"]
                    })
            
            # Match with Projects (Faculty & Industry)
            projects = supabase.table("projects").select('*').eq('status', 'open').execute().data or []
            for project in projects:
                if project['creator_type'] in ['faculty', 'industry']:
                    match = student_to_project(profile, project)
                    if match["match"] > 0:
                        creator = supabase.table('users').select('full_name, email').eq('id', project['creator_id']).execute()
                        results.append({
                            "type": "project",
                            "project": project,
                            "creator": creator.data[0] if creator.data else None,
                            "match": match["match"],
                            "why": match["why"]
                        })

        # FACULTY MATCHING: Show students and student projects
        elif user_type == "faculty":
            # Match with Students
            student_profiles = supabase.table("student_profiles").select('*').execute().data or []
            for student in student_profiles:
                match = faculty_to_student(profile, student)
                if match["match"] > 0:
                    student_user = supabase.table('users').select('full_name, email').eq('id', student['user_id']).execute()
                    results.append({
                        "type": "student",
                        "profile": student,
                        "user": student_user.data[0] if student_user.data else None,
                        "match": match["match"],
                        "why": match["why"]
                    })
            
            # Match with Student Projects
            projects = supabase.table("projects").select('*').eq('status', 'open').eq('creator_type', 'student').execute().data or []
            for project in projects:
                match = faculty_to_project(profile, project)
                if match["match"] > 0:
                    creator = supabase.table('users').select('full_name, email').eq('id', project['creator_id']).execute()
                    results.append({
                        "type": "project",
                        "project": project,
                        "creator": creator.data[0] if creator.data else None,
                        "match": match["match"],
                        "why": match["why"]
                    })

        # INDUSTRY MATCHING: Show students and student projects - NEW!
        elif user_type == "industry":
            # Match with Students
            student_profiles = supabase.table("student_profiles").select('*').execute().data or []
            for student in student_profiles:
                match = industry_to_student(profile, student)
                if match["match"] > 0:
                    student_user = supabase.table('users').select('full_name, email').eq('id', student['user_id']).execute()
                    results.append({
                        "type": "student",
                        "profile": student,
                        "user": student_user.data[0] if student_user.data else None,
                        "match": match["match"],
                        "why": match["why"]
                    })
            
            # Match with Student Projects
            projects = supabase.table("projects").select('*').eq('status', 'open').eq('creator_type', 'student').execute().data or []
            for project in projects:
                match = industry_to_project(profile, project)
                if match["match"] > 0:
                    creator = supabase.table('users').select('full_name, email').eq('id', project['creator_id']).execute()
                    results.append({
                        "type": "project",
                        "project": project,
                        "creator": creator.data[0] if creator.data else None,
                        "match": match["match"],
                        "why": match["why"]
                    })

        # Sort by match score (highest first)
        results.sort(key=lambda r: -r["match"])
        
        return jsonify({
            "status": "success",
            "user_type": user_type,
            "results": results
        })
        
    except Exception as e:
        print("Error in explore endpoint:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


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

# ============================================
# MENTORSHIP REQUEST ENDPOINTS
# ============================================

@app.route('/api/mentorship-requests', methods=['POST'])
def create_mentorship_request():
    """Create a new mentorship request"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['requester_id', 'requester_type', 'recipient_id', 'recipient_type', 'request_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'status': 'error', 'message': f'Missing required field: {field}'}), 400
        
        # Check if request already exists
        existing = supabase.table('mentorship_requests').select('*').eq(
            'requester_id', data['requester_id']
        ).eq('recipient_id', data['recipient_id']).eq('status', 'pending').execute()
        
        if existing.data:
            return jsonify({
                'status': 'error',
                'message': 'You already have a pending mentorship request with this user'
            }), 400
        
        # Create the request
        result = supabase.table('mentorship_requests').insert({
            'requester_id': data['requester_id'],
            'requester_type': data['requester_type'],
            'recipient_id': data['recipient_id'],
            'recipient_type': data['recipient_type'],
            'request_type': data['request_type'],
            'message': data.get('message', '')
        }).execute()
        
        return jsonify({
            'status': 'success',
            'message': 'Mentorship request sent successfully',
            'data': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print(f"Error creating mentorship request: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/mentorship-requests/user/<user_id>', methods=['GET'])
def get_user_mentorship_requests(user_id):
    """Get all mentorship requests for a user (sent and received)"""
    try:
        # Get requests sent by user
        sent_requests = supabase.table('mentorship_requests').select(
            '*, recipient:users!mentorship_requests_recipient_id_fkey(full_name, email)'
        ).eq('requester_id', user_id).execute()
        
        # Get requests received by user
        received_requests = supabase.table('mentorship_requests').select(
            '*, requester:users!mentorship_requests_requester_id_fkey(full_name, email)'
        ).eq('recipient_id', user_id).execute()
        
        return jsonify({
            'status': 'success',
            'data': {
                'sent': sent_requests.data or [],
                'received': received_requests.data or []
            }
        })
        
    except Exception as e:
        print(f"Error fetching mentorship requests: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/mentorship-requests/<request_id>/status', methods=['PUT'])
def update_mentorship_request_status(request_id):
    """Update mentorship request status (accept/reject)"""
    try:
        data = request.json
        status = data.get('status')
        
        if status not in ['accepted', 'rejected', 'cancelled']:
            return jsonify({'status': 'error', 'message': 'Invalid status'}), 400
        
        result = supabase.table('mentorship_requests').update({
            'status': status
        }).eq('id', request_id).execute()
        
        return jsonify({
            'status': 'success',
            'message': f'Mentorship request {status}',
            'data': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print(f"Error updating mentorship request: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/mentorship-requests/check/<requester_id>/<recipient_id>', methods=['GET'])
def check_mentorship_request_exists(requester_id, recipient_id):
    """Check if a mentorship request already exists between two users"""
    try:
        result = supabase.table('mentorship_requests').select('*').eq(
            'requester_id', requester_id
        ).eq('recipient_id', recipient_id).eq('status', 'pending').execute()
        
        return jsonify({
            'status': 'success',
            'exists': len(result.data) > 0,
            'data': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print(f"Error checking mentorship request: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================
# DASHBOARD STATS ENDPOINTS
# ============================================

@app.route('/api/stats/dashboard/<user_id>', methods=['GET'])
def get_dashboard_stats(user_id):
    """Get dashboard statistics for a user"""
    try:
        # Get user info
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        if not user_result.data:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        user = user_result.data[0]
        user_type = user["user_type"]
        
        stats = {
            "matches": 0,
            "applications": 0,
            "projects": 0,
            "requests": 0
        }
        
        # Get matches count (from explore endpoint logic)
        # For students: count faculty + industry mentors + projects with match > 0
        # For faculty/industry: count students + student projects with match > 0
        profile_result = supabase.table(f"{user_type}_profiles").select('*').eq('user_id', user_id).execute()
        if profile_result.data:
            profile = profile_result.data[0]
            match_count = 0
            
            if user_type == "student":
                # Count faculty matches
                faculty_profiles = supabase.table("faculty_profiles").select('*').execute().data or []
                for faculty in faculty_profiles:
                    match = student_to_faculty(profile, faculty)
                    if match["match"] > 0:
                        match_count += 1
                
                # Count industry matches
                industry_profiles = supabase.table("industry_profiles").select('*').execute().data or []
                for industry in industry_profiles:
                    match = student_to_industry(profile, industry)
                    if match["match"] > 0:
                        match_count += 1
                
                # Count project matches
                projects = supabase.table("projects").select('*').eq('status', 'open').execute().data or []
                for project in projects:
                    if project['creator_type'] in ['faculty', 'industry']:
                        match = student_to_project(profile, project)
                        if match["match"] > 0:
                            match_count += 1
            
            elif user_type == "faculty":
                # Count student matches
                student_profiles = supabase.table("student_profiles").select('*').execute().data or []
                for student in student_profiles:
                    match = faculty_to_student(profile, student)
                    if match["match"] > 0:
                        match_count += 1
                
                # Count student project matches
                projects = supabase.table("projects").select('*').eq('status', 'open').eq('creator_type', 'student').execute().data or []
                for project in projects:
                    match = faculty_to_project(profile, project)
                    if match["match"] > 0:
                        match_count += 1
            
            elif user_type == "industry":
                # Count student matches
                student_profiles = supabase.table("student_profiles").select('*').execute().data or []
                for student in student_profiles:
                    match = industry_to_student(profile, student)
                    if match["match"] > 0:
                        match_count += 1
                
                # Count student project matches
                projects = supabase.table("projects").select('*').eq('status', 'open').eq('creator_type', 'student').execute().data or []
                for project in projects:
                    match = industry_to_project(profile, project)
                    if match["match"] > 0:
                        match_count += 1
            
            stats["matches"] = match_count
        
        # Get applications count
        if user_type == "student":
            # Count applications sent by student
            applications = supabase.table('applications').select('id').eq('applicant_id', user_id).execute()
            stats["applications"] = len(applications.data) if applications.data else 0
        else:
            # Count applications received on user's projects
            user_projects = supabase.table('projects').select('id').eq('creator_id', user_id).execute()
            if user_projects.data:
                project_ids = [p['id'] for p in user_projects.data]
                applications = supabase.table('applications').select('id').in_('project_id', project_ids).execute()
                stats["applications"] = len(applications.data) if applications.data else 0
        
        # Get projects count
        user_projects = supabase.table('projects').select('id').eq('creator_id', user_id).eq('status', 'open').execute()
        stats["projects"] = len(user_projects.data) if user_projects.data else 0
        
        # Get mentorship requests count (pending only)
        mentorship_requests = supabase.table('mentorship_requests').select('id').eq(
            'recipient_id', user_id
        ).eq('status', 'pending').execute()
        stats["requests"] = len(mentorship_requests.data) if mentorship_requests.data else 0
        
        return jsonify({
            "status": "success",
            "data": stats
        })
        
    except Exception as e:
        print(f"Error fetching dashboard stats: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
