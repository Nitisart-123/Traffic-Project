import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMapPage = location.pathname === "/";
  const isTablePage = location.pathname === "/table";

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Traffic System</div>

      <div>
        {/* ถ้าอยู่หน้าแผนที่ → แสดงปุ่ม ตารางข้อมูล */}
        {isMapPage && (
          <button
            style={styles.button}
            onClick={() => navigate("/table")}
          >
            ตารางข้อมูล
          </button>
        )}

        {/* ถ้าอยู่หน้าตาราง → แสดงปุ่ม ดูแผนที่ */}
        {isTablePage && (
          <button
            style={styles.button}
            onClick={() => navigate("/")}
          >
            ดูแผนที่
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#1976D2", // สีฟ้า 
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
    marginLeft: "20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;