import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "student") {
    return (
      <div className="p-6 text-red-500 font-semibold">
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        🎓 Welcome to Your Student Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Full Name:</h2>
          <p className="text-gray-600">{user.firstName} {user.lastName}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Email:</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Reg Number:</h2>
          <p className="text-gray-600">{user.regNo}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Role:</h2>
          <p className="text-gray-600 capitalize">{user.role}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-blue-500 mb-2">📚 Your Courses</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Introduction to Computer Science</li>
          <li>Data Structures and Algorithms</li>
          <li>Web Development Basics</li>
          <li>Database Management Systems</li>
        </ul>
      </div>
    </div>
  );
}



// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// import API from '@/services/api'

// export default function StudentDashboard() {
//   const { user } = useContext(AuthContext);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudentCourses = async () => {
//       try {
//         const res = await API.get('/course/all');
//         setCourses(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchStudentCourses();
//     }
//   }, [user]);

//   if (!user) {
//     return (
//       <div className="text-center mt-10 text-red-600 font-semibold">
//         You must be logged in to view your dashboard.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-4">Welcome, {user.name} 👋</h1>
//       <div className="bg-white p-4 rounded-xl shadow-md mb-6">
//         <h2 className="text-xl font-semibold mb-2">Your Info</h2>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>Department:</strong> {user.department || 'N/A'}</p>
//         <p><strong>Level:</strong> {user.level || '100'}</p>
//       </div>

//       <div className="bg-white p-4 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
//         {loading ? (
//           <p>Loading courses...</p>
//         ) : courses.length > 0 ? (
//           <ul className="space-y-2">
//             {courses.map((course) => (
//               <li key={course._id} className="border rounded-md p-3 shadow-sm">
//                 <h3 className="text-lg font-semibold">{course.title}</h3>
//                 <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>You are not enrolled in any courses yet.</p>
//         )}
//       </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Link to="/student/results" className="bg-green-500 text-white p-4 rounded shadow hover:bg-green-600">
//           View Results
//         </Link>
//         <Link to="/student/register-course" className="bg-blue-500 text-white p-4 rounded shadow hover:bg-blue-600">
//           Register Courses
//         </Link>
//         <Link to="/profile" className="bg-purple-500 text-white p-4 rounded shadow hover:bg-purple-600">
//           Profile
//         </Link>
//       </div>
//       <div className="mt-6">
//         <Link
//           to="/register-courses"
//           className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
//         >
//           Register for New Courses
//         </Link>
//       </div>
//     </div>
//   );
// }
