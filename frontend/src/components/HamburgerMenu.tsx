import React, { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { MenuItem, SubMenuItem } from "../types";
import "./HamburgerMenu.css";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: "employees",
      label: "Employees",
      subMenu: [
        { id: "all", label: "All Employees" },
        { id: "active", label: "Active Employees" },
        { id: "inactive", label: "Inactive Employees" },
      ],
    },
    {
      id: "departments",
      label: "Departments",
      subMenu: [
        { id: "hr", label: "Human Resources" },
        { id: "it", label: "IT Department" },
        { id: "sales", label: "Sales" },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      subMenu: null,
    },
    {
      id: "settings",
      label: "Settings",
      subMenu: null,
    },
  ];

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setOpenSubMenu(null);
    }
  };

  const toggleSubMenu = (itemId: string): void => {
    setOpenSubMenu(openSubMenu === itemId ? null : itemId);
  };

  const handleMenuItemClick = (itemId: string): void => {
    console.log("Menu item clicked:", itemId);
    // Handle menu item click
  };

  const handleSubMenuItemClick = (
    parentId: string,
    subItemId: string
  ): void => {
    console.log("Sub-menu item clicked:", parentId, subItemId);
    // Handle sub-menu item click
  };

  return (
    <div className="hamburger-menu">
      <button
        className="hamburger-button"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="menu-overlay" onClick={toggleMenu}>
          <div className="menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h2>Menu</h2>
              <button
                className="close-button"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="menu-nav">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-item-wrapper">
                  <div
                    className={`menu-item ${
                      openSubMenu === item.id ? "active" : ""
                    }`}
                    onClick={() =>
                      item.subMenu
                        ? toggleSubMenu(item.id)
                        : handleMenuItemClick(item.id)
                    }
                  >
                    <span>{item.label}</span>
                    {item.subMenu && (
                      <ChevronRight
                        size={18}
                        className={`submenu-icon ${
                          openSubMenu === item.id ? "rotated" : ""
                        }`}
                      />
                    )}
                  </div>

                  {item.subMenu && openSubMenu === item.id && (
                    <div className="submenu">
                      {item.subMenu.map((subItem) => (
                        <div
                          key={subItem.id}
                          className="submenu-item"
                          onClick={() =>
                            handleSubMenuItemClick(item.id, subItem.id)
                          }
                        >
                          {subItem.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
