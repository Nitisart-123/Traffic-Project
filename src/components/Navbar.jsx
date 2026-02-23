import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMapPage = location.pathname === "/";
  const isTablePage = location.pathname === "/table";

  const pageTitle =
    isMapPage
      ? "แผนที่จราจร"
      : "ตารางข้อมูลการจราจร";

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>{pageTitle}</div>

      <div>
        {isMapPage && (
          <button
            style={styles.button}
            onClick={() => navigate("/table")}
          >
            ตารางข้อมูล
          </button>
        )}

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