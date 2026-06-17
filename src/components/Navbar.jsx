import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "./languagecontext/useLanguage";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 715);
  const menuRef = useRef();

  // ===== ภาษา (จาก Context กลาง) =====
  const { language, setLanguage, t: tAll } = useLanguage();
  const t = tAll.navbar;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 715);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMapPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isTablePage = location.pathname === "/table";

  const handleLogout = () => {
    setShowMenu(false);
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleNavigate = (path) => {
    setShowMenu(false);
    navigate(path);
  };

  const pageTitle = user
    ? (isMapPage ? t.map : isTablePage ? t.table : t.crud)
    : (isMapPage ? t.map : t.login);

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>{pageTitle}</div>

      <div style={{ display: "flex", alignItems: "center" }}>

        {user ? (
          <>
            {!isMobile && (
              <>
                <button style={styles.button} onClick={() => navigate("/")}>{t.viewMap}</button>
                <button style={styles.button} onClick={() => navigate("/table")}>{t.viewTable}</button>
                <button style={styles.button} onClick={() => navigate("/crudnode")}>{t.manage}</button>
              </>
            )}

            <div style={{ position: "relative", marginLeft: "15px" }} ref={menuRef}>
              <button style={styles.buttonIcon} onClick={() => setShowMenu(!showMenu)}>
                ☰
              </button>

              {showMenu && isMobile && (
                <div style={styles.backdrop} onClick={() => setShowMenu(false)} />
              )}

              {showMenu && (
                <div style={isMobile ? styles.dropdownMobile : styles.dropdown}>
                  {!isMobile && <div style={styles.triangle} />}

                  {isMobile && (
                    <div style={styles.navGroup}>
                      <div style={styles.menuHeader}>{t.menu}</div>
                      <button style={styles.navBtn} onClick={() => handleNavigate("/")}>
                        <i className="bi bi-geo-alt" style={styles.navBtnIcon}></i>{t.viewMap}
                      </button>
                      <button style={styles.navBtn} onClick={() => handleNavigate("/table")}>
                        <i className="bi bi-table" style={styles.navBtnIcon}></i>{t.viewTable}
                      </button>
                      <button style={styles.navBtn} onClick={() => handleNavigate("/crudnode")}>
                        <i className="bi bi-clipboard-data" style={styles.navBtnIcon}></i>{t.manage}
                      </button>
                    </div>
                  )}

                  <div style={styles.profileBox}>
                    <span style={styles.userText}>{user.mem_rank}</span>
                    <span style={styles.userText}>{user.mem_name}</span>
                  </div>

                  {/* ===== Language Toggle ===== */}
                  <div style={styles.langBox}>
                    <i className="bi bi-globe2" style={styles.langIcon}></i>
                    <span style={styles.langLabel}>{t.langLabel}</span>
                    <div style={styles.langToggle}>
                      <button
                        style={{ ...styles.langBtn, ...(language === "th" ? styles.langBtnActive : {}) }}
                        onClick={() => setLanguage("th")}
                      >
                        {t.langTh}
                      </button>
                      <button
                        style={{ ...styles.langBtn, ...(language === "en" ? styles.langBtnActive : {}) }}
                        onClick={() => setLanguage("en")}
                      >
                        {t.langEn}
                      </button>
                    </div>
                  </div>

                  <button style={styles.logoutBtn} onClick={handleLogout}>
                    {t.logout}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {!isMapPage && (
              <button style={styles.button} onClick={() => navigate("/")}>{t.viewMap}</button>
            )}
            {!isLoginPage && (
              <button style={styles.button} onClick={() => navigate("/login")}>{t.login}</button>
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
    fontFamily: "'Prompt', sans-serif",
    fontSize: "25px",
    fontWeight: "bold",
  },

  button: {
    fontFamily: "'Prompt', sans-serif",
    backgroundColor: "white",
    color: "#1976D2",
    border: "none",
    padding: "8px 16px",
    marginLeft: "15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  buttonIcon: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    padding: "4px 6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "32px",
    lineHeight: 1,
  },

  dropdown: {
    position: "absolute",
    top: "48px",
    right: "17px",
    background: "white",
    borderRadius: "12px 0 12px 12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    padding: "12px",
    minWidth: "220px",
    zIndex: 100,
  },

  navGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
    marginBottom: "10px",
  },

  navBtnIcon: {
    marginRight: "8px",
    fontSize: "16px",
  },

  navBtn: {
    width: "100%",
    padding: "10px 4px",
    background: "transparent",
    color: "#111",
    border: "none",
    borderBottom: "1px solid #e5e7eb",
    cursor: "pointer",
    textAlign: "left",
  },

  menuHeader: {
    fontWeight: "bold",
    color: "#111",
    fontSize: "24px",
    marginBottom: "8px",
    paddingBottom: "10px",
    borderBottom: "1px solid #e5e7eb",
  },

  dropdownMobile: {
    position: "fixed",
    top: "0px",
    right: "0px",
    background: "white",
    borderRadius: "0 0 0 16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    padding: "20px",
    width: "280px",
    zIndex: 200,
  },

  profileBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },

  userText: {
    fontWeight: "bold",
    color: "#333",
  },

  // ===== Language Toggle =====
  langBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 0",
    marginBottom: "4px",
    borderBottom: "1px solid #e5e7eb",
  },

  langIcon: {
    color: "#64748b",
    fontSize: "15px",
    flexShrink: 0,
  },

  langLabel: {
    color: "#333",
    fontWeight: "bold",
    fontSize: "14px",
    flexShrink: 0,
  },

  langToggle: {
    display: "flex",
    marginLeft: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    overflow: "hidden",
  },

  langBtn: {
    padding: "4px 10px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
  },

  langBtnActive: {
    backgroundColor: "#1976D2",
    color: "white",
  },

  logoutBtn: {
    fontFamily: "'Prompt', sans-serif",
    width: "100%",
    padding: "8px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px",
  },

  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 199,
  },

  triangle: {
    position: "absolute",
    top: "-7px",
    right: "0px",
    width: 0,
    height: 0,
    borderLeft: "20px solid transparent",
    borderRight: "0px solid transparent",
    borderBottom: "10px solid white",
  },
};

export default Navbar;
