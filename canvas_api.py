import requests
import os
from typing import List, Dict, Optional

class CanvasAPI:
    def __init__(self, domain: str = "osu.instructure.com", token: str = None):
        """
        Initialize Canvas API client
        
        Args:
            domain: Canvas domain (e.g., 'osu.instructure.com')
            token: API access token
        """
        self.domain = domain
        self.token = token or "8597~3y8YBt9WzVcrkTDaEBKJxaY4naVc6uv3DhFYU9WKmhDfQV9h6eh2zYUtZht44N2G"
        self.base_url = f"https://{domain}/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
    
    def get_assignments(self, course_id: str, **params) -> List[Dict]:
        """
        Get all assignments for a specific course
        
        Args:
            course_id: The Canvas course ID
            **params: Additional query parameters
            
        Returns:
            List of assignment dictionaries
        """
        url = f"{self.base_url}/courses/{course_id}/assignments"
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching assignments: {e}")
            raise
    
    def get_assignment(self, course_id: str, assignment_id: str) -> Dict:
        """
        Get a specific assignment by ID
        
        Args:
            course_id: The Canvas course ID
            assignment_id: The assignment ID
            
        Returns:
            Assignment dictionary
        """
        url = f"{self.base_url}/courses/{course_id}/assignments/{assignment_id}"
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching assignment: {e}")
            raise
    
    def get_courses(self, **params) -> List[Dict]:
        """
        Get all courses for the authenticated user
        
        Args:
            **params: Additional query parameters
            
        Returns:
            List of course dictionaries
        """
        url = f"{self.base_url}/courses"
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching courses: {e}")
            raise
    
    def get_course(self, course_id: str) -> Dict:
        """
        Get course details by ID
        
        Args:
            course_id: The Canvas course ID
            
        Returns:
            Course dictionary
        """
        url = f"{self.base_url}/courses/{course_id}"
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching course: {e}")
            raise
    
    def get_user_profile(self) -> Dict:
        """
        Get user profile information
        
        Returns:
            User profile dictionary
        """
        url = f"{self.base_url}/users/self/profile"
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching user profile: {e}")
            raise

def main():
    """Main function to demonstrate Canvas API usage"""
    canvas = CanvasAPI()
    
    try:
        print("🎓 Canvas API Client (Python)")
        print("=============================\n")
        
        # Get user profile
        print("📋 Fetching user profile...")
        profile = canvas.get_user_profile()
        email = profile.get('email', 'No email available')
        print(f"👤 User: {profile['name']} ({email})")
        print(f"🆔 User ID: {profile['id']}\n")
        
        # Get all courses
        print("📚 Fetching courses...")
        courses = canvas.get_courses()
        print(f"Found {len(courses)} courses:\n")
        
        for course in courses:
            name = course.get('name', 'Unnamed Course')
            code = course.get('course_code', 'No code')
            state = course.get('workflow_state', 'Unknown')
            print(f"📖 {name} (ID: {course['id']})")
            print(f"   Code: {code}")
            print(f"   State: {state}\n")
        
        # If you have a specific course ID, you can fetch its assignments
        if courses:
            first_course = courses[0]
            course_name = first_course.get('name', 'Unnamed Course')
            print(f"📝 Fetching assignments for: {course_name}")
            
            assignments = canvas.get_assignments(first_course['id'])
            print(f"Found {len(assignments)} assignments:\n")
            
            for assignment in assignments:
                print(f"📋 {assignment['name']}")
                print(f"   Due: {assignment.get('due_at', 'No due date')}")
                print(f"   Points: {assignment.get('points_possible', 'N/A')}")
                print(f"   Status: {assignment['workflow_state']}\n")
                
    except Exception as e:
        print(f"❌ Error: {e}")

def get_course_assignments(course_id: str):
    """
    Example function to get assignments for a specific course
    
    Args:
        course_id: The Canvas course ID
    """
    canvas = CanvasAPI()
    
    try:
        print(f"📝 Fetching assignments for course {course_id}...")
        assignments = canvas.get_assignments(course_id)
        
        print(f"Found {len(assignments)} assignments:\n")
        for assignment in assignments:
            print(f"📋 {assignment['name']}")
            print(f"   ID: {assignment['id']}")
            print(f"   Due: {assignment.get('due_at', 'No due date')}")
            print(f"   Points: {assignment.get('points_possible', 'N/A')}")
            print(f"   Status: {assignment['workflow_state']}")
            
            description = assignment.get('description', '')
            if description:
                print(f"   Description: {description[:100]}...")
            else:
                print(f"   Description: No description")
            print()
        
        return assignments
    except Exception as e:
        print(f"❌ Error fetching assignments: {e}")
        raise

if __name__ == "__main__":
    main() 