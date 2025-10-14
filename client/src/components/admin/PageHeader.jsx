import React from "react";

const PageHeader = ({ title, description, children }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

const PageHeaderRight = ({ children }) => {
  return <div>{children}</div>;
};

PageHeader.Right = PageHeaderRight;

export default PageHeader;
