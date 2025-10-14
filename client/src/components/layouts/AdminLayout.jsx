import React, { Suspense, useState } from "react";

import { Header, Sidebar } from "../admin";

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </Suspense>
  );
};

export default AdminLayout;
