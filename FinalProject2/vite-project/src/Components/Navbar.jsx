import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";
import { FaUserCircle, FaClipboardList } from "react-icons/fa";

export default function Navbar({ onShowOrders }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowMenu(false);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Luxury Housewares</div>

      <div style={styles.rightSection}>
        <button
          onClick={onShowOrders}
          title="ההזמנות שלי"
          style={styles.ordersBtn}
        >
          <FaClipboardList size={20} />
        </button>

        {currentUser ? (
          <div style={styles.userMenuContainer}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={styles.userBtn}
              title="תפריט משתמש"
            >
              <FaUserCircle size={24} />
              <span style={{ marginLeft: 6 }}>{currentUser.username}</span>
            </button>

            {showMenu && (
              <div style={styles.dropdownMenu}>
                <button onClick={handleLogout} style={styles.dropdownItem}>
                  התנתק
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.authButtons}>
            <button
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("showUserForm", { detail: "login" })
                )
              }
              style={styles.authBtn}
            >
              התחבר
            </button>
            <button
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("showUserForm", { detail: "register" })
                )
              }
              style={{ ...styles.authBtn, marginLeft: 10 }}
            >
              הרשמה
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: "100%",
    height: 60,
    backgroundColor: "#1a1a1a",
    color: "#ffd700",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
    position: "fixed",
    top: 0,
    zIndex: 1200,
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    userSelect: "none",
    cursor: "default",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
  },
  ordersBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ffd700",
    cursor: "pointer",
    fontSize: 20,
    marginRight: 15,
    padding: 6,
    borderRadius: 6,
    transition: "background-color 0.2s ease",
  },
  userMenuContainer: {
    position: "relative",
  },
  userBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ffd700",
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    marginTop: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 6,
    boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
    padding: "8px 0",
    minWidth: 120,
    zIndex: 1300,
  },
  dropdownItem: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ffd700",
    width: "100%",
    padding: "8px 16px",
    textAlign: "right",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "600",
    userSelect: "none",
  },
  authButtons: {
    display: "flex",
  },
  authBtn: {
    backgroundColor: "transparent",
    border: "1.5px solid #ffd700",
    borderRadius: 6,
    color: "#ffd700",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "600",
    padding: "6px 14px",
    userSelect: "none",
    transition: "background-color 0.3s ease",
  },
};
