import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";


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

        navigate("/crudnode"); // ✅ ใส่ตรงนี้
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2>เข้าสู่ระบบ</h2>

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
    },
    box: {
        width: "300px",
        padding: "20px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    },
    input: {
        width: "100%",
        marginBottom: "10px",
        padding: "8px",
    },
    button: {
        width: "100%",
        padding: "10px",
        background: "#2563eb",
        color: "white",
        border: "none",
    },
    error: {
        color: "red"
    }
};

export default Login;