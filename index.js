require('dotenv').config();
const CanvasAPI = require('./canvas-api');

async function main() {
  const canvas = new CanvasAPI();
  
  try {
    console.log('🎓 Canvas API Client');
    console.log('===================\n');

    // Get user profile
    console.log('📋 Fetching user profile...');
    const profile = await canvas.getUserProfile();
    console.log(`👤 User: ${profile.name} (${profile.email})`);
    console.log(`🆔 User ID: ${profile.id}\n`);

    // Get all courses
    console.log('📚 Fetching courses...');
    const courses = await canvas.getCourses();
    console.log(`Found ${courses.length} courses:\n`);
    
    courses.forEach(course => {
      console.log(`📖 ${course.name} (ID: ${course.id})`);
      console.log(`   Code: ${course.course_code}`);
      console.log(`   State: ${course.workflow_state}\n`);
    });

    // If you have a specific course ID, you can fetch its assignments
    if (courses.length > 0) {
      const firstCourse = courses[0];
      console.log(`📝 Fetching assignments for: ${firstCourse.name}`);
      
      const assignments = await canvas.getAssignments(firstCourse.id);
      console.log(`Found ${assignments.length} assignments:\n`);
      
      assignments.forEach(assignment => {
        console.log(`📋 ${assignment.name}`);
        console.log(`   Due: ${assignment.due_at || 'No due date'}`);
        console.log(`   Points: ${assignment.points_possible || 'N/A'}`);
        console.log(`   Status: ${assignment.workflow_state}\n`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Example function to get assignments for a specific course
async function getCourseAssignments(courseId) {
  const canvas = new CanvasAPI();
  
  try {
    console.log(`📝 Fetching assignments for course ${courseId}...`);
    const assignments = await canvas.getAssignments(courseId);
    
    console.log(`Found ${assignments.length} assignments:\n`);
    assignments.forEach(assignment => {
      console.log(`📋 ${assignment.name}`);
      console.log(`   ID: ${assignment.id}`);
      console.log(`   Due: ${assignment.due_at || 'No due date'}`);
      console.log(`   Points: ${assignment.points_possible || 'N/A'}`);
      console.log(`   Status: ${assignment.workflow_state}`);
      console.log(`   Description: ${assignment.description ? assignment.description.substring(0, 100) + '...' : 'No description'}\n`);
    });
    
    return assignments;
  } catch (error) {
    console.error('❌ Error fetching assignments:', error.message);
    throw error;
  }
}

// Export functions for use in other modules
module.exports = {
  main,
  getCourseAssignments
};

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
} 