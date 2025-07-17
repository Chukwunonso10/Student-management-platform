export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <p>Loading user...</p>;

  if (user.role === "admin") return <Dashboard />;
  if (user.role === "student") return <StudentDashboard />;

  return <p>Unknown role: {user.role}</p>;
}
