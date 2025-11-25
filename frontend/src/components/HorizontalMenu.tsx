import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { MenuItem } from "../types";
import { useAuth } from "../context/AuthContext";
import "./HorizontalMenu.css";

const HorizontalMenu: React.FC = () => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const menuItems: MenuItem[] = [
    ...(isAdmin ? [{
      id: "dashboard",
      label: "Dashboard",
      subMenu: null,
    }] : []),
    {
      id: "employees",
      label: "Employees",
      subMenu: null,
    },
  ];

  const handleMouseEnter = (itemId: string): void => {
    if (menuItems.find((item) => item.id === itemId)?.subMenu) {
      setOpenSubMenu(itemId);
    }
  };

  const handleMouseLeave = (): void => {
    setOpenSubMenu(null);
  };

  const handleMenuItemClick = (itemId: string): void => {
    console.log("Menu item clicked:", itemId);
    if (itemId === "dashboard") {
      navigate("/dashboard");
    } else if (itemId === "employees") {
      navigate("/employees");
    }
  };

  const handleSubMenuItemClick = (
    parentId: string,
    subItemId: string
  ): void => {
    console.log("Sub-menu item clicked:", parentId, subItemId);
    setOpenSubMenu(null);
    
    if (parentId === "employees") {
      navigate("/employees");
    } else if (parentId === "dashboard") {
      navigate("/dashboard");
    }
  };

  const isActive = (itemId: string) => {
    if (itemId === "dashboard" && location.pathname === "/dashboard") return true;
    if (itemId === "employees" && location.pathname === "/employees") return true;
    return false;
  };

  return (
    <nav className="horizontal-menu">
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className="menu-item"
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`menu-link ${isActive(item.id) || openSubMenu === item.id ? "active" : ""}`}
              onClick={() => handleMenuItemClick(item.id)}
            >
              {item.label}
              {item.subMenu && (
                <ChevronDown
                  size={16}
                  className={`chevron ${
                    openSubMenu === item.id ? "rotated" : ""
                  }`}
                />
              )}
            </button>

            {item.subMenu && openSubMenu === item.id && (
              <ul className="submenu">
                {item.subMenu.map((subItem) => (
                  <li key={subItem.id}>
                    <button
                      className="submenu-link"
                      onClick={() =>
                        handleSubMenuItemClick(item.id, subItem.id)
                      }
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HorizontalMenu;
