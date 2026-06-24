import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import bgImage from "../../assets/22959.jpg";
import CreateNode from "./CreateNode";
import EditNode from "./EditNode";
import DeleteNode from "./DeleteNode";
import { useLanguage } from "../languagecontext/useLanguage";

const CrudNode = ({ user }) => {

    const [nodes, setNodes] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchedName, setSearchedName] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteNodeData, setDeleteNodeData] = useState(null);

    // ===== ภาษา (จาก Context กลาง) — แปลเฉพาะ UI ไม่แปลข้อมูลจากฐานข้อมูล =====
    const { t: tAll } = useLanguage();
    const t = tAll.crudNode;

    const fetchNodes = async () => {
        const querySnapshot = await getDocs(collection(db, "Sensor_Node"));

        let data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // ===== กรองข้อมูลตาม mem_id ของผู้ใช้ที่เข้าสู่ระบบ =====
        if (user?.mem_id) {
            data = data.filter((node) => node.mem_id === user.mem_id);
        }

        setNodes(data);
    };

    useEffect(() => {
        const loadNodes = async () => {
            const querySnapshot = await getDocs(collection(db, "Sensor_Node"));

            let data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // ===== กรองข้อมูลตาม mem_id ของผู้ใช้ที่เข้าสู่ระบบ =====
            if (user?.mem_id) {
                data = data.filter((node) => node.mem_id === user.mem_id);
            }

            setNodes(data);
        };
        loadNodes();
    }, [user]);

    const openEditModal = (node) => {
        setSelectedNode(node);
        setShowEditModal(true);
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

    const openDeleteModal = (node) => {
        setDeleteNodeData(node);
        setShowDeleteModal(true);
    };

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>{t.title}</h1>

            {/* ค้นหา + ปุ่มเพิ่ม */}
            <div style={styles.topBar}>

                <div style={styles.searchBox}>
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={styles.searchInput}
                    />
                    <button style={styles.searchButton} onClick={handleSearch}>
                        {t.searchButton}
                    </button>
                    {searchedName !== "" && (
                        <button style={styles.resetButton} onClick={handleReset}>
                            {t.resetButton}
                        </button>
                    )}
                </div>

                <button
                    style={styles.addButton}
                    onClick={() => setShowCreateModal(true)}
                >
                    {t.addButton}
                </button>

            </div>

            {/* ตาราง */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>{t.colNodeId}</th>
                            <th style={styles.th}>{t.colRoadName}</th>
                            <th style={styles.th}>{t.colLatitude}</th>
                            <th style={styles.th}>{t.colLongitude}</th>
                            <th style={styles.th}>{t.colActions}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredNodes.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={styles.noData}>
                                    {t.noData}
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
                                        <button
                                            style={styles.editButton}
                                            onClick={() => openEditModal(node)}
                                        >
                                            {t.editButton}
                                        </button>

                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => openDeleteModal(node)}
                                        >
                                            {t.deleteButton}
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
                    user={user}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchNodes();
                    }}
                />
            )}

            {showEditModal && selectedNode && (
                <EditNode
                    nodeData={selectedNode}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        setShowEditModal(false);
                        fetchNodes();
                    }}
                />
            )}

            {showDeleteModal && deleteNodeData && (
                <DeleteNode
                    nodeData={deleteNodeData}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={() => {
                        setShowDeleteModal(false);
                        fetchNodes();
                    }}
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
        fontFamily: "'Prompt', sans-serif",
        textAlign: "center",
        marginBottom: "40px",
        fontSize: "50px",
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
        backgroundColor: "#1976D2",
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
