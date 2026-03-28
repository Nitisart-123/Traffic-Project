import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMapPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isTablePage = location.pathname === "/table";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const pageTitle = user
    ? (
      isMapPage
        ? "แผนที่จราจร"
        : isTablePage
          ? "ตารางข้อมูลการจราจร"
          : "จัดการโหนดเซนเซอร์"
    )
    : (
      isMapPage
        ? "แผนที่จราจร"
        : "เข้าสู่ระบบ"
    );

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>{pageTitle}</div>

      <div style={{ display: "flex", alignItems: "center" }}>

        {user ? (
          <>
            <button style={styles.button} onClick={() => navigate("/")}>
              ดูแผนที่
            </button>

            <button style={styles.button} onClick={() => navigate("/table")}>
              ตารางข้อมูล
            </button>

            <button style={styles.button} onClick={() => navigate("/crudnode")}>
              จัดการโหนด
            </button>

            {/* ACCOUNT BUTTON — อยู่ขวาสุด */}
            <div style={{ position: "relative", marginLeft: "15px" }} ref={menuRef}>
              <button
                style={styles.buttonIcon}
                onClick={() => setShowMenu(!showMenu)}
              >
                ☰
              </button>

              {showMenu && (
                <div style={styles.dropdown}>
                  <div style={styles.profileBox}>
                    <span style={styles.userText}>{user.mem_rank}</span>
                    <span style={styles.userText}>{user.mem_name}</span>
                  </div>

                  <hr />

                  <button style={styles.logoutBtn} onClick={handleLogout}>
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {!isMapPage && (
              <button style={styles.button} onClick={() => navigate("/")}>
                ดูแผนที่
              </button>
            )}

            {!isLoginPage && (
              <button style={styles.button} onClick={() => navigate("/login")}>
                เข้าสู่ระบบ
              </button>
            )}
          </>
        )}

      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#1976D2",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "white",
    color: "#1976D2",
    border: "none",
    padding: "8px 16px",
    marginLeft: "15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  // ไม่มีพื้นหลัง ไม่มี border สีขาว
  buttonIcon: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    padding: "0px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "40px",
    lineHeight: 1,
  },

  dropdown: {
    position: "absolute",
    top: "56px",
    right: "0",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    padding: "12px",
    minWidth: "200px",
    zIndex: 100,
  },

  logoutBtn: {
    width: "100%",
    padding: "8px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px",
  },

  profileBox: {
    display: "flex",
    minWidth: "210px",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },

  userText: {
    fontWeight: "bold",
    color: "#333",
  },
};

export default Navbar;
