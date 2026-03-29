import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/22959.jpg";

const Login = ({ onLogin }) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {

        setError("");

        if (!email || !password) {
            setError("กรุณากรอกข้อมูลให้ครบ");
            return;
        }

        const snapshot = await getDocs(collection(db, "Traffic_Mem"));

        const user = snapshot.docs.find(doc => {
            const data = doc.data();
            return data.mem_email === email && data.mem_password === password;
        });

        if (!user) {
            setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            return;
        }

        const userData = {
            id: user.id,
            ...user.data()
        };

        localStorage.setItem("user", JSON.stringify(userData));

        onLogin(userData);

        navigate("/"); // ✅ ใส่ตรงนี้
    };

    return (
        <div style={styles.container}>
            {/* 🔥 HEADER */}
            <h1 style={styles.header}>
                ระบบตรวจจับและวิเคราะห์การจราจรติดขัด
            </h1>

            <div style={styles.box}>
                <h2 style={styles.h2}>เข้าสู่ระบบ</h2>

                {error && <p style={styles.error}>{error}</p>}

                <input
                    placeholder="อีเมล"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button onClick={handleLogin} style={styles.button}>
                    เข้าสู่ระบบ
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        backgroundImage: `
      linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)),
      url(${bgImage})
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
    },

    header: {
        position: "absolute",   // 🔥 ลอยด้านบน
        top: "100px",
        fontSize: "50px",
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        textShadow: "0px 0px 7px rgb(255, 255, 255)"
    },

    box: {
        width: "580px",
        padding: "30px",
        marginBottom: "80px",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
    },

    input: {
        width: "100%",
        marginBottom: "20px",
        padding: "16px",
        fontSize: "20px",   // 👈 เพิ่ม
        borderRadius: "8px",
        border: "1px solid #ccc",
        boxSizing: "border-box",   // 👈 เพิ่มบรรทัดนี้
    },

    button: {
        width: "100%",
        padding: "16px",
        fontSize: "20px",   // 👈 เพิ่ม
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
    },

    h2: {
        fontSize: "40px",   // 👈 เพิ่ม
        marginTop: "0px",
        marginBottom: "15px",
        textAlign: "center",
    },
    error: {
        color: "red"
    }
};

export default Login;