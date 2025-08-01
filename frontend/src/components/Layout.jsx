import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, PlusCircle, Sparkles, LogOut, Heart } from "lucide-react";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Discover", href: "/dashboard", icon: Home },
    { name: "My Studio", href: "/my-studio", icon: Sparkles },
    { name: "New Session", href: "/session-editor", icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg relative">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Fitness</h2>
                <p className="text-xs text-gray-500">Wellness Studio</p>
              </div>
            </div>
          </div>

          <nav className="p-3">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 shadow-sm border border-emerald-200/50"
                          : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                  <span className="text-gray-700 font-medium">
                    {user?.full_name?.[0] || user?.email?.[0] || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {user?.full_name || "Wellness Practitioner"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen overflow-hidden">
          <main className="w-full px-6 py-6">
            <div className="max-w-5xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
