import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
 
export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      {/* pt-16 compensa la altura del navbar fijo */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}