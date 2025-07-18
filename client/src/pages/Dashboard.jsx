// src/pages/Dashboard.jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">University Management Dashboard</h1>
        {user ? (
          <>
            <p className="mb-4">Welcome, <span className="font-semibold">{user.lastName}</span>!</p>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Link to="/student-dashboard" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow">
                🎓 Student Portal
              </Link>
              <Link to="/admin-dashboard" className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl shadow">
                🛠 Admin Panel
              </Link>
              <Link to="/faculty-dashboard" className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl shadow">
                👨‍🏫 Faculty Dashboard
              </Link>
              <Link to="/courses" className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-xl shadow">
                📚 Course Management
              </Link>
            </div>
          </>
        ) : (
          <p>Please login to access your dashboard.</p>
        )}
      </div>
    </div>
  );
}
