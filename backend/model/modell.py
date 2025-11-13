def get_top_matches(top_n=3):
    import pandas as pd
    import numpy as np
    import re
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import os

    

    BASE_DIR = os.path.dirname(os.path.realpath(__file__))

    students_path = os.path.join(BASE_DIR, "students.csv")
    projects_path = os.path.join(BASE_DIR, "projects.csv")
    faculty_path = os.path.join(BASE_DIR, "faculty.csv")
    students_path = os.path.join(BASE_DIR, "students.csv")
    if not os.path.exists(students_path):
        print("ERROR: students.csv not found at", students_path)


    # Debug prints to make sure paths are correct
    print("Students CSV path:", students_path)
    print("Projects CSV path:", projects_path)
    print("Faculty CSV path:", faculty_path)

    students = pd.read_csv(students_path)
    projects = pd.read_csv(projects_path)
    faculty = pd.read_csv(faculty_path)
    


    '''BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    students_path = os.path.join(BASE_DIR, "students.csv")
    projects_path = os.path.join(BASE_DIR, "projects.csv")
    faculty_path = os.path.join(BASE_DIR, "faculty.csv")

    students = pd.read_csv(students_path)
    projects = pd.read_csv(projects_path)
    faculty = pd.read_csv(faculty_path)
    print("Students CSV path:", students_path)
    print("Projects CSV path:", projects_path)
    print("Faculty CSV path:", faculty_path)


'''

    def clean_text(text):
        if pd.isna(text): return ""
        text = str(text).lower()
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    students['clean_profile'] = students['Profile'].apply(clean_text)
    projects['clean_skills'] = projects['Required_Skills'].apply(clean_text)
    faculty['clean_expertise'] = faculty['Expertise'].apply(clean_text)

    student_txt = students['clean_profile']
    project_txt = projects['clean_skills']
    faculty_txt = faculty['clean_expertise']

    all_txt = pd.concat([student_txt, project_txt, faculty_txt])
    vt = TfidfVectorizer()
    vt.fit(all_txt)

    student_vectors = vt.transform(student_txt)
    project_vectors = vt.transform(project_txt)
    faculty_vectors = vt.transform(faculty_txt)

    similarity_matrix = cosine_similarity(student_vectors, project_vectors)
    student_faculty_sim = cosine_similarity(student_vectors, faculty_vectors)

    result = []

    for i, student_row in students.iterrows():
        student_data = {
            "student_name": student_row['Name'],
            "student_profile": student_row['Profile'],
            "top_projects": [],
            "top_faculty": []
        }

        # Top projects
        top_projects_idx = np.argsort(-similarity_matrix[i])[:top_n]
        for idx in top_projects_idx:
            project = projects.iloc[idx]
            score = similarity_matrix[i][idx]
            student_data["top_projects"].append({
                "title": project['Title'],
                "skills": project['Required_Skills'],
                "score": round(float(score), 2)
            })

        # Top faculty
        top_faculty_idx = np.argsort(-student_faculty_sim[i])[:top_n]
        for idx in top_faculty_idx:
            fac = faculty.iloc[idx]
            score = student_faculty_sim[i][idx]
            student_data["top_faculty"].append({
                "name": fac['Name'],
                "expertise": fac['Expertise'],
                "score": round(float(score), 2)
            })

        result.append(student_data)

    return result



if __name__ == "__main__":
    results = get_top_matches(top_n=3)
    for student in results:
        print(student)
