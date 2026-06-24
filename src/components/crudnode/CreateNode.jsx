import React, { useState } from "react";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useLanguage } from "../languagecontext/useLanguage";

const CreateNode = ({ user, onClose, onSuccess }) => {

    const [nodeId, setNodeId] = useState("");
    const [nodeName, setNodeName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // ===== ภาษา (จาก Context กลาง) — แปลเฉพาะ UI ไม่แปลข้อมูลจากฐานข้อมูล =====
    const { t: tAll } = useLanguage();
    const t = tAll.createNode;


    const generateNodeId = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";

        for (let i = 0; i < 6; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }

        setNodeId(result);
    };

    const handleSave = async () => {

        setErrorMessage("");

        if (!nodeId || !nodeName || !latitude || !longitude) {
            setErrorMessage(t.errorRequired);
            return;
        }

        // 🔥 เช็คห้ามมีอักษรพิเศษ
        if (!/^[a-zA-Z0-9]+$/.test(nodeId)) {
            setErrorMessage(t.errorInvalidChars);
            return;
        }

        // 🔥 เช็คความยาวต้อง = 6 ตัว
        if (nodeId.length !== 6) {
            setErrorMessage(t.errorLength);
            return;
        }

        try {

            const q = query(
                collection(db, "Sensor_Node"),
                where("node_id", "==", nodeId)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setErrorMessage(t.errorDuplicate);
                return;
            }

            await addDoc(collection(db, "Sensor_Node"), {
                node_id: nodeId,
                node_name: nodeName,
                node_latitude: latitude,
                node_longitude: longitude,
                node_speed: 0,
                node_countcar: 0,
                node_status: "Normal",
                node_battery: 0,
                node_datetime: Timestamp.now(),
                mem_id: user?.mem_id || ""
            });

            // แจ้ง CrudNode ให้ดึงข้อมูลใหม่ทันที
            onSuccess();

        } catch (error) {

            console.error(error);
            setErrorMessage(t.errorSaveFailed);

        }
    };

    return (
        <div style={styles.overlay}>

            <div style={styles.modal}>

                <div style={styles.header}>
                    <h2>{t.title}</h2>

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
                    <label>{t.labelNodeId}</label>
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
                            {t.randomButton}
                        </button>
                    </div>

                    <label>{t.labelNodeName}</label>
                    <input
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        style={styles.input}
                    />

                    <label>{t.labelLatitude}</label>
                    <input
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        style={styles.input}
                    />

                    <label>{t.labelLongitude}</label>
                    <input
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.footer}>
                    <button style={styles.saveButton} onClick={handleSave}>
                        {t.saveButton}
                    </button>

                    <button style={styles.cancelButton} onClick={onClose}>
                        {t.cancelButton}
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
