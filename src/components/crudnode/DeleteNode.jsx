import React from "react";
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const DeleteNode = ({ nodeData, onClose, onSuccess }) => {

    const handleDelete = async () => {

        try {

            /* ลบข้อมูลใน Sensor_Node */
            await deleteDoc(doc(db, "Sensor_Node", nodeData.id));

            /* ค้นหาข้อมูลใน Sensor_Log ที่ node_id ตรงกัน */
            const q = query(
                collection(db, "Sensor_Log"),
                where("node_id", "==", nodeData.node_id)
            );

            const querySnapshot = await getDocs(q);

            /* ลบทุก document ที่พบ */
            const deletePromises = querySnapshot.docs.map((logDoc) =>
                deleteDoc(logDoc.ref)
            );

            await Promise.all(deletePromises);

            onSuccess();

        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (

        <div style={styles.overlay}>

            <div style={styles.modal}>

                <h2 style={styles.title}>คุณต้องการลบข้อมูลโหนดเซนเซอร์{nodeData.node_name}หรือไม่?</h2>

                <p style={styles.warning}>
                    ประวัติข้อมูลย้อนหลังจะถูกลบ!
                </p>

                <div style={styles.buttonGroup}>
                    <button
                        style={styles.deleteButton}
                        onClick={handleDelete}
                    >
                        ลบข้อมูล
                    </button>
                    <button
                        style={styles.cancelButton}
                        onClick={onClose}
                    >
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
        zIndex: 999
    },

    modal: {
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        width: "420px",
        textAlign: "center"
    },

    title: {
        fontFamily: "'Prompt', sans-serif",
        marginBottom: "0px",
        marginTop: "0px",
        fontSize: "27px",
    },

    text: {
        fontSize: "18px"
    },

    nodeName: {
        fontSize: "20px",
        fontWeight: "bold",
        margin: "10px 0"
    },

    warning: {
        color: "#ef4444",
        fontSize: "14px",
        marginBottom: "20px"
    },

    buttonGroup: {
        display: "flex",
        justifyContent: "center",
        gap: "15px"
    },

    cancelButton: {
        padding: "10px 18px",
        border: "none",
        backgroundColor: "#94a3b8",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer"
    },

    deleteButton: {
        padding: "10px 18px",
        border: "none",
        backgroundColor: "#ef4444",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer"
    }
};

export default DeleteNode;