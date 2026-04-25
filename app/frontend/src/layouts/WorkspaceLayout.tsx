import { Outlet, useLocation } from "react-router-dom";
import { WorkspaceSidebar } from "../components/WorkspaceSidebar";

function isSampleTemplatesBrowsePath(pathname: string) {
  return /^\/create-document\/templates\/[^/]+$/.test(pathname);
}

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard";
}

function isDocumentsPath(pathname: string) {
  return pathname === "/documents";
}

function isEmployeesPath(pathname: string) {
  return pathname === "/dashboard/employees";
}

export function WorkspaceLayout() {
  const { pathname } = useLocation();
  const mainClass = [
    "wb-dash__main",
    isSampleTemplatesBrowsePath(pathname) ? "wb-dash__main--sample-templates" : "",
    isDashboardPath(pathname) ? "wb-dash__main--dashboard" : "",
    isDocumentsPath(pathname) ? "wb-dash__main--documents" : "",
    isEmployeesPath(pathname) ? "wb-dash__main--employees" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="wb-dash">
      <WorkspaceSidebar />
      <main className={mainClass} id="top">
        <Outlet />
      </main>
    </div>
  );
}
