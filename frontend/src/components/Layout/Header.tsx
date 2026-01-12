import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { LogOut, Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-blue-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold ml-2">
            Gestor de Videoconferencias
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded-md transition-colors"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
