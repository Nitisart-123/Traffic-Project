import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isMapPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isTablePage = location.pathname === "/table";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // 👈 กลับหน้า map
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
        ? "แผนที่จราจร"   // 👈 ยังไม่ login แต่เป็นหน้า map
        : "เข้าสู่ระบบ"
    );

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>{pageTitle}</div>

      <div>

        {user ? (
          <>
            <button
              style={styles.button}
              onClick={() => navigate("/")}
            >
              ดูแผนที่
            </button>

            <button
              style={styles.button}
              onClick={() => navigate("/table")}
            >
              ตารางข้อมูล
            </button>

            <button
              style={styles.button}
              onClick={() => navigate("/crudnode")}
            >
              จัดการโหนด
            </button>

            <button
              style={styles.button}
              onClick={handleLogout}
            >
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            {/* แสดงดูแผนที่เฉพาะตอนที่ไม่ใช่หน้า map */}
            {!isMapPage && (
              <button
                style={styles.button}
                onClick={() => navigate("/")}
              >
                ดูแผนที่
              </button>
            )}

            {/* ❌ ถ้าอยู่หน้า login → ไม่ต้องแสดงปุ่ม login */}
            {!isLoginPage && (
              <button
                style={styles.button}
                onClick={() => navigate("/login")}
              >
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
};

export default Navbar;