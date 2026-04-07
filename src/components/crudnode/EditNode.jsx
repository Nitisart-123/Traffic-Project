import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const EditNode = ({ nodeData, onClose, onSuccess }) => {

    const [nodeName, setNodeName] = useState(nodeData?.node_name || "");
    const [latitude, setLatitude] = useState(nodeData?.node_latitude || "");
    const [longitude, setLongitude] = useState(nodeData?.node_longitude || "");
    const [errorMessage, setErrorMessage] = useState("");

    const handleUpdate = async () => {

        setErrorMessage("");

        // 🔥 เช็คค่าว่าง
        if (!nodeName.trim() || !latitude || !longitude) {
            setErrorMessage("กรุณากรอกข้อมูลให้ครบ");
            return;
        }

        try {
            const nodeRef = doc(db, "Sensor_Node", nodeData.id);

            await updateDoc(nodeRef, {
                node_name: nodeName,
                node_latitude: latitude,
                node_longitude: longitude
            });

            onSuccess();
        } catch (error) {
            console.error("Update Error:", error);
            setErrorMessage("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.title}>แก้ไขข้อมูลโหนดเซนเซอร์</h2>
                    <button style={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                {errorMessage && (
                    <div style={styles.errorText}>
                        {errorMessage}
                    </div>
                )}

                <label style={styles.label}>ชื่อโหนด</label>
                <input
                    style={styles.input}
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                />

                <label style={styles.label}>ละติจูด</label>
                <input
                    style={styles.input}
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />

                <label style={styles.label}>ลองจิจูด</label>
                <input
                    style={styles.input}
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />

                <div style={styles.buttonGroup}>
                    <button style={styles.saveButton} onClick={handleUpdate}>
                        บันทึก
                    </button>

                    <button style={styles.cancelButton} onClick={onClose}>
                        ยกเลิก
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
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },

    modal: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        width: "350px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },

    title: {
        fontFamily: "'Prompt', sans-serif",
        margin: 0,
        textAlign: "left",
    },

    errorText: {
        color: "red",
        marginBottom: "10px",
        fontWeight: "bold",
    },

    closeButton: {
        background: "transparent",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        color: "#64748b",
        lineHeight: 1,
        padding: "0 4px",
    },

    label: {
        marginTop: "10px",
        marginBottom: "5px",
        fontWeight: "bold",
    },

    input: {
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },

    buttonGroup: {
        display: "flex",
        justifyContent: "end",
        marginTop: "20px",
    },

    saveButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "10px",
    },

    cancelButton: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer",
    },
};

export default EditNode;
