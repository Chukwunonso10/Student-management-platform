// src/components/UserRow.jsx
export default function UserRow({ user, index }) {
  return (
    <tr className="border-b">
      <td className="p-2">{index + 1}</td>
      <td className="p-2">{user.firstName} {user.lastName}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.role}</td>
    </tr>
  );
}
