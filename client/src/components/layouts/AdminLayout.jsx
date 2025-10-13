import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <main className="bg-gray-100 min-h-screen">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
