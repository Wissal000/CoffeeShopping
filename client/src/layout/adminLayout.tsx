import { Outlet, NavLink } from "react-router-dom";
import {
  Coffee,
  PlusCircle,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0a0a0b] text-white">
      {/* ===== SIDEBAR ===== */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 250 }}
        transition={{ duration: 0.25 }}
        className="relative border-r border-white/10 bg-[#0d0d0e] flex flex-col overflow-hidden"
      >
        {/* subtle gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        {/* TOP */}
        <div className="p-4 relative z-10">
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 text-black">
              <Coffee size={16} />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  Java Admin
                </h1>
                <p className="text-[11px] text-gray-500">Dashboard</p>
              </div>
            )}
          </div>

          {/* NAV */}
          <nav className="flex flex-col gap-1">
            <NavItem
              to="/admin/products"
              icon={<LayoutGrid size={18} />}
              label="Products"
              collapsed={collapsed}
            />
            <NavItem
              to="/admin/add-product"
              icon={<PlusCircle size={18} />}
              label="Add Product"
              collapsed={collapsed}
            />
            <NavItem
              to="/admin/orders"
              icon={<ShoppingCart size={18} />}
              label="Orders"
              collapsed={collapsed}
            />
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="mt-auto p-4 border-t border-white/10 text-xs text-gray-600 text-center">
          {!collapsed ? "Java Admin © 2026" : "©"}
        </div>

        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-6 -right-3 
  w-7 h-7 flex items-center justify-center 
  rounded-full bg-[#111] border border-white/10 
  hover:bg-white/10 transition shadow z-20"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* ===== RIGHT SIDE ===== */}
      <div className="flex-1 flex flex-col">
        {/* ===== TOPBAR ===== */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0b]/80 backdrop-blur-xl">
          <p className="text-sm text-gray-400">Dashboard</p>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400" />
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
function NavItem({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-md"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`
      }
    >
      {/* ICON */}
      <div className="flex items-center justify-center w-5 transition group-hover:scale-110">
        {icon}
      </div>

      {/* LABEL */}
      {!collapsed && (
        <span className="font-medium tracking-tight">{label}</span>
      )}

      {/* HOVER GLOW */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
      bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur transition"
      />

      {/* ACTIVE INDICATOR */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full 
      bg-yellow-400 opacity-0 group-[.active]:opacity-100"
      />

      {/* TOOLTIP */}
      {collapsed && (
        <span
          className="absolute left-16 whitespace-nowrap bg-black text-xs px-2 py-1 rounded-md 
        opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg"
        >
          {label}
        </span>
      )}
    </NavLink>
  );
}
