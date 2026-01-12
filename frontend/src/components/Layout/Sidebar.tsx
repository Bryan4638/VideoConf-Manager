import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, MapPin, Users, Video } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { to: "/dashboard", icon: <Calendar size={20} />, text: "Panel Principal" },
    {
      to: "/conferences",
      icon: <Video size={20} />,
      text: "Videoconferencias",
    },
    { to: "/locations", icon: <MapPin size={20} />, text: "Ubicaciones" },
    { to: "/technicians", icon: <Users size={20} />, text: "Técnicos" },
    { to: "/users", icon: <Users size={20} />, text: "Usuarios" },
  ];

  const activeClass = "bg-blue-700 text-white";
  const inactiveClass = "text-blue-100 hover:bg-blue-800 hover:text-white";

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:relative md:z-0`}
      >
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-6 text-center">VideoConf</h2>

          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                        isActive ? activeClass : inactiveClass
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
