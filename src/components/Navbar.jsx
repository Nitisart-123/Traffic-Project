import React from "react";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Traffic System</div>

      <div>
        <button style={styles.button}>ตารางข้อมูล</button>
        <button style={styles.button}>จัดการโหนดเซนเซอร์</button>
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
    // position: "absolute",
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
    marginLeft: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;
