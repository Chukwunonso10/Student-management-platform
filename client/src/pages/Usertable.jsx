// src/components/UserTable.jsx
import UserRow from "@/pages/UserRow";

export default function UserTable({ users }) {
  return (
    <table className="w-full mt-4 border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2">#</th>
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <UserRow key={user._id} user={user} index={index} />
        ))}
      </tbody>
    </table>
  );
}
