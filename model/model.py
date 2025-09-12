import pandas as pd 
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
student=pd.read_csv("students.csv")
projects= pd.read_csv("projects.csv")
#testing bruhh!! 
#print(student.head)
#print (projects.head)


student_txt =student['Profile']
project_txt = projects['Required_Skills']

all_txt = pd. concat([student_txt, project_txt])
vt = TfidfVectorizer()
vt.fit(all_txt)
#vector formation
student_vectors = vt.transform(student_txt)   # num_students x num_features
project_vectors = vt.transform(project_txt)
#similarity
similarity_matrix = cosine_similarity(student_vectors, project_vectors)
'''
TOP_N=3
for i, students in student.iterrows():
    scores = list(enumerate(similarity_matrix[i]))
    # Sort projects by similarity score (highest first)
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    
print(f"\nTop {TOP_N} matches for {student['Name']} ({student['Profile']}):")
for proj_index, score in sorted_scores[:TOP_N]:
        project = projects.iloc[proj_index]
print(f"  -> {project['Title']} ({project['Required_Skills']}) | Score: {score:.2f}")

'''

top_n = 3  # Top 3 project matches per student

for i, student in student.iterrows():
    top_projects_idx = np.argsort(-similarity_matrix[i])[:top_n]  # sort descending
    top_projects = projects.iloc[top_projects_idx]

print(f"\n👩‍🎓 Student: {student['Name']} ({student['Profile']})")
print("Top Project Matches:")
for j, proj in top_projects.iterrows():
        score = similarity_matrix[i][j]
print(f"  - {proj['Title']} (Skills: {proj['Required_Skills']}) | Score: {score:.2f}")