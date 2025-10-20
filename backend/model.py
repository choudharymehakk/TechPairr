import os
import re
import pandas as pd 
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
students_path = os.path.join(BASE_DIR, "students.csv")
projects_path = os.path.join(BASE_DIR, "projects.csv")
faculty_path = os.path.join(BASE_DIR,"faculty.csv")

#testing bruhh!! 
#print(student.head)
#print (projects.head)
#loading 
students = pd.read_csv(students_path)   # Student_ID, Name, Profile
projects = pd.read_csv(projects_path) 
faculty= pd.read_csv(faculty_path)
# ---------- cleaning function ----------
def clean_text(text):
    if pd.isna(text):
        return ""
    text = str(text).lower()
    # remove punctuation (commas, dots, parentheses, etc.) and keep alphanum + spaces
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    # collapse multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text
# ---------- prepare cleaned text columns ----------
students['clean_profile'] = students['Profile'].apply(clean_text)
projects['clean_skills'] = projects['Required_Skills'].apply(clean_text)
faculty['clean_expertise'] = faculty['Expertise'].apply(clean_text)

student_txt = students['clean_profile']
project_txt = projects['clean_skills']
faculty_txt = faculty['clean_expertise']



all_txt = pd. concat([student_txt, project_txt, faculty_txt])
vt = TfidfVectorizer()
vt.fit(all_txt)
#vector formation
student_vectors = vt.transform(student_txt)   # num_students x num_features
project_vectors = vt.transform(project_txt)
faculty_vectors = vt.transform(faculty_txt)
#similarity
similarity_matrix = cosine_similarity(student_vectors, project_vectors)
student_faculty_sim = cosine_similarity(student_vectors, faculty_vectors)

top_n = 2
for i, student_row in students.iterrows():
    scores = similarity_matrix[i]                 # similarity of student i with all projects
    top_idx = np.argsort(-scores)[:top_n]         # indices of top projects
    print(f"\n👩‍🎓 Student: {student_row['Name']} ({student_row['Profile']})")
    print("Top Project Matches:")
    for proj_idx in top_idx:
        proj_row = projects.iloc[proj_idx]
        score = scores[proj_idx]
        print(f"  - {proj_row['Title']} (Skills: {proj_row['Required_Skills']}) | Score: {score:.2f}")

 # --- Faculty ---
    top_faculty_idx = np.argsort(-student_faculty_sim[i])[:top_n]
    print("Top Faculty Matches:")
    for j in top_faculty_idx:
        fac = faculty.iloc[j]
        score = student_faculty_sim[i][j]
        print(f"  - {fac['Name']} (Expertise: {fac['Expertise']}) | Score: {score:.2f}")