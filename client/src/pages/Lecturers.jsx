import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function LecturerDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-2">Hello, Dr. {user.lastName}</h1>
      <p className="text-md mb-5">Lecturer Dashboard</p>

      <div className="space-y-4">
        <Link to="/lecturer/submit-results" className="block bg-orange-500 text-white p-4 rounded hover:bg-orange-600">
          Submit Student Results
        </Link>
        <Link to="/profile" className="block bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
          View Profile
        </Link>
      </div>
    </div>
  );
}
