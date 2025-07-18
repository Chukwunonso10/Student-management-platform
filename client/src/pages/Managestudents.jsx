import { useEffect, useState } from "react";
import API from "../services/api";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      const res = await API.get("/admin/students");
      setStudents(res.data);
    }
    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">👥 Manage Students</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Reg No</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td className="border px-4 py-2">{student.firstName} {student.lastName}</td>
              <td className="border px-4 py-2">{student.regNo}</td>
              <td className="border px-4 py-2">{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
