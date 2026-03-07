import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import bgImage from "../../assets/22959.jpg";
import CreateNode from "./CreateNode";

const CrudNode = () => {

    const [nodes, setNodes] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchedName, setSearchedName] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchNodes = async () => {
        const querySnapshot = await getDocs(collection(db, "Sensor_Node"));

        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setNodes(data);
    };

    useEffect(() => {
        const loadNodes = async () => {
            const querySnapshot = await getDocs(collection(db, "Sensor_Node"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNodes(data);
        };
        loadNodes();
    }, []);

    const deleteNode = async (id) => {
        if (window.confirm("ต้องการลบข้อมูลหรือไม่?")) {
            await deleteDoc(doc(db, "Sensor_Node", id));
            fetchNodes();
        }
    };

    const handleSearch = () => {
        setSearchedName(searchName);
    };

    const handleReset = () => {
        setSearchName("");
        setSearchedName("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const filteredNodes = nodes.filter((node) =>
        node.node_name?.toLowerCase().includes(searchedName.toLowerCase())
    );

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>ระบบจัดการโหนดเซนเซอร์</h1>

            {/* ค้นหา + ปุ่มเพิ่ม */}
            <div style={styles.topBar}>

                <div style={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อถนน..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={styles.searchInput}
                    />
                    <button style={styles.searchButton} onClick={handleSearch}>
                        ค้นหา
                    </button>
                    {searchedName !== "" && (
                        <button style={styles.resetButton} onClick={handleReset}>
                            รีเซ็ต
                        </button>
                    )}
                </div>

                <button
                    style={styles.addButton}
                    onClick={() => setShowCreateModal(true)}
                >
                    + เพิ่มข้อมูล
                </button>

            </div>

            {/* ตาราง */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>รหัสโหนด</th>
                            <th style={styles.th}>ชื่อถนน</th>
                            <th style={styles.th}>ละติจูด</th>
                            <th style={styles.th}>ลองจิจูด</th>
                            <th style={styles.th}>จัดการ</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredNodes.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={styles.noData}>
                                    ไม่พบข้อมูลที่ค้นหา
                                </td>
                            </tr>
                        ) : (
                            filteredNodes.map((node) => (
                                <tr key={node.id} style={styles.row}>

                                    <td style={styles.td}>{node.node_id}</td>
                                    <td style={styles.td}>{node.node_name}</td>
                                    <td style={styles.td}>{node.node_latitude}</td>
                                    <td style={styles.td}>{node.node_longitude}</td>

                                    <td style={styles.actionCell}>
                                        <button style={styles.editButton}>
                                            แก้ไข
                                        </button>

                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => deleteNode(node.id)}
                                        >
                                            ลบ
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {showCreateModal && (
                <CreateNode
                    onClose={() => setShowCreateModal(false)}
                />
            )}

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

    topBar: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        marginBottom: "10px",
        flexWrap: "wrap",
    },

    searchBox: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    searchInput: {
        width: "280px",
        padding: "10px 15px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
    },

    searchButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px",
    },

    resetButton: {
        backgroundColor: "#94a3b8",
        color: "white",
        border: "none",
        padding: "10px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px",
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

    noData: {
        padding: "30px",
        textAlign: "center",
        fontSize: "18px",
        color: "#dc2626",
        fontWeight: "bold",
    },

    tableWrapper: {
        display: "flex",
        justifyContent: "center",
    },

    table: {
        width: "80%",
        borderCollapse: "collapse",
        background: "white",
        fontSize: "18px",
        borderRadius: "10px",
        overflow: "hidden",
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

    actionCell: {
        padding: "16px 12px",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
    },
};

export default CrudNode;
