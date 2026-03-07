import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const EditNode = ({ nodeData, onClose, onSuccess }) => {

    const [nodeName, setNodeName] = useState(nodeData?.node_name || "");
    const [latitude, setLatitude] = useState(nodeData?.node_latitude || "");
    const [longitude, setLongitude] = useState(nodeData?.node_longitude || "");

    const handleUpdate = async () => {

        try {

            const nodeRef = doc(db, "Sensor_Node", nodeData.id);

            await updateDoc(nodeRef, {
                node_name: nodeName,
                node_latitude: latitude,
                node_longitude: longitude
            });

            // แจ้ง CrudNode ให้ดึงข้อมูลใหม่ทันที
            onSuccess();

        } catch (error) {
            console.error("Update Error:", error);
        }

    };

    return (

        <div style={styles.overlay}>

            <div style={styles.modal}>

                <h2 style={styles.title}>
                    แก้ไขข้อมูลโหนดเซนเซอร์
                </h2>

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
        zIndex: 1000
    },

    modal: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        width: "350px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column"
    },

    title: {
        textAlign: "center",
        marginBottom: "20px"
    },

    label: {
        marginTop: "10px",
        marginBottom: "5px",
        fontWeight: "bold"
    },

    input: {
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ccc"
    },

    buttonGroup: {
        display: "flex",
        justifyContent: "end",
        marginTop: "20px"
    },

    saveButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "10px"
    },

    cancelButton: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer"
    }

};

export default EditNode;
