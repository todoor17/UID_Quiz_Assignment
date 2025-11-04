"use client";

import { useState } from "react";
import AdminDashboard from "../../components/AdminDashboard";
import { initialUsers, initialClasses } from "../../lib/types";

export default function AdminPage() {
  const [users, setUsers] = useState(initialUsers);
  const [classes, setClasses] = useState(initialClasses);
  const admin = users.find((u) => u.role === "admin");
  // TODO: Replace with proper auth and redirect
  if (!admin) return <div>No admin found!</div>;
  return (
    <AdminDashboard
      currentUser={admin}
      users={users}
      classes={classes}
      onLogout={() => {}}
      onUpdateUsers={setUsers}
      onUpdateClasses={setClasses}
    />
  );
}
