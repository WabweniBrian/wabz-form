import React, { ReactNode } from "react";

function BuilderLayout({ children }: { children: ReactNode }) {
  return <div className="flex-center-center min-h-screen">{children}</div>;
}

export default BuilderLayout;
