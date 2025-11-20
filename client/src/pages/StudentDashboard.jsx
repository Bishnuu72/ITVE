import React from "react";
import StudentSidebar from "../components/common/StudentSidebar";
import StudentTopbar from "../components/common/StudentTopbar";

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <StudentTopbar />

        {/* Dashboard content */}
        <div className="p-6 flex-1">
          <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
          <p className="text-lg text-gray-700">
            Welcome to your dashboard. Use the sidebar to navigate through your profile, courses, fees, notices, and messages.
          </p>
        </div>
      </div>
    </div>
  );
}