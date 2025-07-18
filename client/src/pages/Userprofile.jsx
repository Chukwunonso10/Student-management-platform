import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function UserProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 bg-white shadow-md rounded max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">👤 User Profile</h2>
      <ul className="space-y-2">
        <li><strong>First Name:</strong> {user.firstName}</li>
        <li><strong>Last Name:</strong> {user.lastName}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Role:</strong> {user.role}</li>
        <li><strong>Reg Number:</strong> {user.regNo}</li>
      </ul>
    </div>
  );
}
