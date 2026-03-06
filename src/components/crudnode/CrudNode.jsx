import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import bgImage from "../../assets/22959.jpg";

const CrudNode = () => {

    const [nodes, setNodes] = useState([]);

    const fetchNodes = async () => {
        const querySnapshot = await getDocs(collection(db, "Sensor_Node"));

        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setNodes(data);
    };

    useEffect(() => {

        const fetchNodes = async () => {
            const querySnapshot = await getDocs(collection(db, "Sensor_Node"));

            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setNodes(data);
        };

        fetchNodes();

    }, []);

    const deleteNode = async (id) => {
        if (window.confirm("ต้องการลบข้อมูลหรือไม่?")) {
            await deleteDoc(doc(db, "Sensor_Node", id));
            fetchNodes();
        }
    };

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>ระบบจัดการโหนดเซนเซอร์</h1>

            {/* ปุ่มเพิ่มข้อมูล */}
            <div style={styles.buttonBox}>
                <button style={styles.addButton}>
                    เพิ่มข้อมูล
                </button>
            </div>

            {/* ตาราง */}
            <table style={styles.table}>

                <thead>
                    <tr>
                        <th style={styles.th}>รหัสโหนด</th>
                        <th style={styles.th}>ชื่อถนน</th>
                        <th style={styles.th}>ละติจูด</th>
                        <th style={styles.th}>ลองจิจูด</th>
                        <th style={styles.th}>แก้ไข</th>
                        <th style={styles.th}>ลบ</th>
                    </tr>
                </thead>

                <tbody>
                    {nodes.map((node) => (
                        <tr key={node.id} style={styles.row}>

                            <td style={styles.td}>{node.node_id}</td>
                            <td style={styles.td}>{node.node_name}</td>
                            <td style={styles.td}>{node.node_latitude}</td>
                            <td style={styles.td}>{node.node_longitude}</td>

                            <td style={styles.td}>
                                <button style={styles.editButton}>
                                    แก้ไข
                                </button>
                            </td>

                            <td style={styles.td}>
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => deleteNode(node.id)}
                                >
                                    ลบ
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
};

const styles = {

    container: {
        padding: "60px 40px",
        minHeight: "100vh",
        backgroundImage: `
            linear-gradient(
                rgba(255,255,255,0.35),
                rgba(255,255,255,0.35)
            ),
            url(${bgImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
    },

    title: {
        textAlign: "center",
        marginBottom: "40px",
        fontSize: "36px",
        fontWeight: "bold",
        color: "#1f2937",
        textShadow: "0px 0px 7px rgb(255,255,255)"
    },

    buttonBox: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "15px",
    },

    addButton: {
        backgroundColor: "#16a34a",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        fontSize: "18px",
    },

    th: {
        padding: "16px 12px",
        backgroundColor: "#f1f5f9",
        fontWeight: "bold",
        textAlign: "center",
    },

    td: {
        padding: "16px 12px",
        textAlign: "center",
    },

    row: {
        borderBottom: "1px solid #ddd",
    },

    editButton: {
        backgroundColor: "#f59e0b",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    deleteButton: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default CrudNode;