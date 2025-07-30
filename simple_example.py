import requests

# Configuration
ACCESS_TOKEN = "8597~3y8YBt9WzVcrkTDaEBKJxaY4naVc6uv3DhFYU9WKmhDfQV9h6eh2zYUtZht44N2G"
COURSE_ID = "188984"  # 25-26 QUIC Modules course ID
API_URL = f"https://osu.instructure.com/api/v1/courses/{COURSE_ID}/assignments"

# Set up headers with Bearer token
headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}

try:
    # Make the API request
    response = requests.get(API_URL, headers=headers)
    response.raise_for_status()  # Raise an exception for bad status codes
    
    # Parse the JSON response
    assignments = response.json()
    
    print(f"Found {len(assignments)} assignments for course {COURSE_ID}:\n")
    
    # Print each assignment
    for assignment in assignments:
        print(f"📋 {assignment['name']} - Due: {assignment.get('due_at', 'No due date')}")
        print(f"   ID: {assignment['id']}")
        print(f"   Points: {assignment.get('points_possible', 'N/A')}")
        print(f"   Status: {assignment['workflow_state']}")
        print()
        
except requests.exceptions.RequestException as e:
    print(f"❌ Error making request: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Status code: {e.response.status_code}")
        print(f"Response: {e.response.text}")
except Exception as e:
    print(f"❌ Unexpected error: {e}") 