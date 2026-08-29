import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Dynamic Seller Sidebar */}
      <SellerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
