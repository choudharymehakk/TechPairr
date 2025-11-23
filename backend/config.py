import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('https://cledgwhsdfztnxlbhfkp.supabase.co')
SUPABASE_KEY = os.getenv('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZWRnd2hzZGZ6dG54bGJoZmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODg0OTUsImV4cCI6MjA3NDI2NDQ5NX0.ri2ttquHO821FKDCfGA3OXq4Fq8O21jaRizH2802Sig')
JWT_SECRET = os.getenv('JWT_SECRET', 'bWp3q3yTAJKtU0ujnmGFj71Qq9k/s2HNm3CWOp5G2GgvZCIERwUjJgo8fMvW1vJ2KO6kh2yDsfCLelrBU6mcNQ==')
