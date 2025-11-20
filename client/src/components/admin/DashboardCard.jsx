import React from "react";

export default function DashboardCard({ title, value, icon, bgColor = "bg-blue-600" }) {
  return (
    <div className={`flex items-center p-6 rounded shadow ${bgColor} text-white`}>
      {/* Icon */}
      <div className="text-4xl mr-4">{icon}</div>

      {/* Title and Value */}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
