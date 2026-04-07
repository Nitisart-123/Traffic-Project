import React, { useState } from "react";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";

const CreateNode = ({ onClose, onSuccess }) => {

    const [nodeId, setNodeId] = useState("");
    const [nodeName, setNodeName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const generateNodeId = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";

        for (let i = 0; i < 6; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }

        setNodeId(result);
    };

    const handleSave = async () => {

        setErrorMessage("");

        if (!nodeId || !nodeName || !latitude || !longitude) {
            setErrorMessage("กรุณากรอกข้อมูลให้ครบ");
            return;
        }

        // 🔥 เช็คห้ามมีอักษรพิเศษ
        if (!/^[a-zA-Z0-9]+$/.test(nodeId)) {
            setErrorMessage("รหัสห้ามมีอักขระพิเศษ (!@#$%^)");
            return;
        }

        // 🔥 เช็คความยาวต้อง = 6 ตัว
        if (nodeId.length !== 6) {
            setErrorMessage("รหัสต้องมีความยาว 6 ตัวอักษร");
            return;
        }

        try {

            const q = query(
                collection(db, "Sensor_Node"),
                where("node_id", "==", nodeId)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setErrorMessage("มีรหัสนี้ในระบบแล้ว");
                return;
            }

            await addDoc(collection(db, "Sensor_Node"), {
                node_id: nodeId,
                node_name: nodeName,
                node_latitude: latitude,
                node_longitude: longitude,
                node_speed: 0,
                node_countcar: 0,
                node_status: "รถไหลปกติ",
                node_battery: 0,
                node_datetime: Timestamp.now()
            });

            onSuccess();

        } catch (error) {
            console.error(error);
            setErrorMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    return (
        <div style={styles.overlay}>

            <div style={styles.modal}>

                <div style={styles.header}>
                    <h2>เพิ่มข้อมูลโหนดเซนเซอร์</h2>

                    <button style={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                {errorMessage && (
                    <div style={styles.errorText}>
                        {errorMessage}
                    </div>
                )}

                <div style={styles.body}>
                    <label>รหัสโหนด</label>
                    <div style={styles.idBox}>
                        <input
                            value={nodeId}
                            onChange={(e) => setNodeId(e.target.value)}
                            style={styles.input}
                        />

                        <button
                            style={styles.randomButton}
                            onClick={generateNodeId}
                        >
                            สุ่ม
                        </button>
                    </div>

                    <label>ชื่อโหนด</label>
                    <input
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        style={styles.input}
                    />

                    <label>พิกัดละติจูด</label>
                    <input
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        style={styles.input}
                    />

                    <label>พิกัดลองจิจูด</label>
                    <input
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.footer}>
                    <button style={styles.saveButton} onClick={handleSave}>
                        บันทึก
                    </button>

                    <button style={styles.cancelButton} onClick={onClose}>
                        ปิด
                    </button>
                </div>

            </div>

        </div>
    );
};

const styles = {

    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },

    modal: {
        width: "420px",
        background: "white",
        borderRadius: "10px",
        padding: "25px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
    },

    header: {
        fontFamily: "'Prompt', sans-serif",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },

    closeButton: {
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer",
    },

    body: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    input: {
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },

    idBox: {
        display: "flex",
        gap: "10px",
    },

    randomButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
    },

    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "20px",
    },

    saveButton: {
        background: "#16a34a",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
    },

    cancelButton: {
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
    },

    errorText: {
        color: "red",
        marginBottom: "10px",
        fontWeight: "bold"
    },
};

export default CreateNode;
