import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "./languagecontext/useLanguage";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 715);
  const [showLangMenu, setShowLangMenu] = useState(false); // navbar (ก่อน login)
  const [showLangMenuInDropdown, setShowLangMenuInDropdown] = useState(false); // ใน hamburger dropdown
  const menuRef = useRef();
  const langMenuRef = useRef();
  const langMenuInDropdownRef = useRef();
  const flagButtonRef = useRef();
  const [flagCenterX, setFlagCenterX] = useState(null);
  const [flagBottomY, setFlagBottomY] = useState(null);

  // ===== ภาษา (จาก Context กลาง) =====
  const { language, setLanguage, t: tAll } = useLanguage();
  const t = tAll.navbar;

  const languages = [
    { code: "th", flag: "https://flagcdn.com/w80/th.png", label: t.langTh },
    { code: "en", flag: "https://flagcdn.com/w80/gb.png", label: t.langEn },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
      if (langMenuInDropdownRef.current && !langMenuInDropdownRef.current.contains(e.target)) {
        setShowLangMenuInDropdown(false);
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

  // อัปเดตตำแหน่ง dropdown เมื่อ scroll หรือ resize ขณะเปิดอยู่
  useEffect(() => {
    if (!showLangMenu) return;

    const updatePosition = () => {
      if (flagButtonRef.current) {
        const rect = flagButtonRef.current.getBoundingClientRect();
        setFlagCenterX(rect.left + rect.width / 2);
        setFlagBottomY(rect.bottom);
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showLangMenu]);

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

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    setShowLangMenu(false);
    setShowLangMenuInDropdown(false);
  };

  const currentFlag = languages.find((l) => l.code === language)?.flag;

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

                  {/* ===== Language Picker (ในเมนู dropdown) ===== */}
                  <div style={{ position: "relative" }} ref={langMenuInDropdownRef}>
                    <div
                      style={styles.langBox}
                      onClick={() => setShowLangMenuInDropdown(!showLangMenuInDropdown)}
                    >
                      <img src={currentFlag} alt="flag" style={styles.flagCircle} />
                      <span style={styles.langLabel}>{t.langLabel}</span>
                      <i className="bi bi-chevron-down" style={styles.chevron}></i>
                    </div>

                    {showLangMenuInDropdown && (
                      <div style={styles.langPicker}>
                        {languages.map((l) => (
                          <div
                            key={l.code}
                            style={styles.langPickerItem}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                            onClick={() => handleSelectLanguage(l.code)}
                          >
                            <img src={l.flag} alt={l.label} style={styles.flagCircleSmall} />
                            <span style={styles.langPickerText}>{l.label}</span>
                            {language === l.code && (
                              <i className="bi bi-check-lg" style={styles.checkIcon}></i>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
            {/* ===== Language Picker (navbar, ยังไม่ login) ===== */}
            <div style={{ position: "relative" }} ref={langMenuRef}>
              <button
                ref={flagButtonRef}
                style={styles.flagButton}
                onClick={() => {
                  setShowLangMenu((prev) => !prev);
                }}
              >
                <img src={currentFlag} alt="flag" style={styles.flagCircle} />
              </button>

              {showLangMenu && (
                <div style={isMobile
                  ? { ...styles.langPickerNavMobile, top: (flagBottomY ?? 70) + 8, left: flagCenterX ?? "50%", transform: "translateX(-50%)" }
                  : styles.langPickerNav}>
                  <div style={isMobile ? styles.langTriangleMobile : styles.langTriangle} />
                  <div style={styles.langPickerInner}>
                    {languages.map((l) => (
                      <div
                        key={l.code}
                        style={styles.langPickerItem}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                        onClick={() => handleSelectLanguage(l.code)}
                      >
                        <img src={l.flag} alt={l.label} style={styles.flagCircleSmall} />
                        <span style={styles.langPickerText}>{l.label}</span>
                        {language === l.code && (
                          <i className="bi bi-check-lg" style={styles.checkIcon}></i>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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

  // ===== ไอคอนธงกลม =====
  flagCircle: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    objectFit: "cover",
    backgroundColor: "white",
    border: "2px solid #ffffff",
    flexShrink: 0,
  },

  flagCircleSmall: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    objectFit: "cover",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    flexShrink: 0,
  },

  // ===== ปุ่มไอคอนธง บน navbar (ก่อน login) =====
  flagButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginRight: "8px",
    display: "flex",
    alignItems: "center",
  },

  // ===== Language Picker Dropdown (ในเมนู hamburger, white) =====
  langBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 0",
    marginBottom: "4px",
    borderBottom: "1px solid #e5e7eb",
    cursor: "pointer",
  },

  langLabel: {
    color: "#333",
    fontWeight: "bold",
    fontSize: "14px",
    flexShrink: 0,
  },

  chevron: {
    marginLeft: "auto",
    color: "#64748b",
    fontSize: "12px",
  },

  langPicker: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    zIndex: 300,
  },

  // ===== Language Picker Dropdown (navbar, ก่อน login - Desktop) =====
  langPickerNav: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    border: "1px solid #e5e7eb",
    overflow: "visible",
    zIndex: 300,
    minWidth: "170px",
  },

  // ===== Language Picker Dropdown (navbar, ก่อน login - Tablet/Mobile) =====
  langPickerNavMobile: {
    position: "fixed",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    border: "1px solid #e5e7eb",
    overflow: "visible",
    zIndex: 300,
    minWidth: "170px",
  },

  // สามเหลี่ยมมุมขวาบน (Desktop)
  langTriangle: {
    position: "absolute",
    top: "-8px",
    right: "14px",
    width: 0,
    height: 0,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
    borderBottom: "8px solid white",
  },

  // สามเหลี่ยมด้านเท่า กลางบน (Tablet/Mobile)
  langTriangleMobile: {
    position: "absolute",
    top: "-9px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "9px solid transparent",
    borderRight: "9px solid transparent",
    borderBottom: "9px solid white",
  },

  langPickerInner: {
    borderRadius: "10px",
    overflow: "hidden",
  },

  langPickerItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    backgroundColor: "white",
  },

  langPickerText: {
    flex: 1,
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: "bold",
  },

  checkIcon: {
    color: "#16a34a",
    fontSize: "16px",
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
    top: "-8px",
    right: "14px",
    width: 0,
    height: 0,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
    borderBottom: "8px solid white",
  },
};

export default Navbar;
