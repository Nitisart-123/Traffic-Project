import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import bgImage from "../../assets/22959.jpg";
import History from "./History";

function Table() {
    const [nodes, setNodes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logUnsubscribe, setLogUnsubscribe] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [searchedName, setSearchedName] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "Sensor_Node"),
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                data.sort((a, b) =>
                    b.node_datetime?.seconds - a.node_datetime?.seconds
                );

                setNodes(data);
            }
        );

        return () => unsubscribe();
    }, []);

    const getBatteryColor = (battery) => {
        if (battery > 70) return "#16a34a";
        if (battery > 30) return "#eab308";
        return "#dc2626";
    };

    const getStatusColor = (status) => {
        if (status === "รถติดหยุดนิ่ง" || status === "รถติดมาก")
            return "#dc2626";
        if (status === "รถติดน้อย")
            return "#eab308";
        if (status === "รถไหลปกติ")
            return "#16a34a";
    };

    const openHistory = (nodeId) => {
        if (logUnsubscribe) {
            logUnsubscribe();
        }

        setLogs([]);
        setShowModal(true);

        const q = query(
            collection(db, "Sensor_Log"),
            where("node_id", "==", nodeId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            logData.sort((a, b) =>
                b.log_datetime?.seconds - a.log_datetime?.seconds
            );

            setLogs(logData);
        });

        setLogUnsubscribe(() => unsubscribe);
    };

    const closeModal = () => {
        if (logUnsubscribe) {
            logUnsubscribe();
            setLogUnsubscribe(null);
        }

        setShowModal(false);
        setLogs([]);
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
            <h1 style={styles.title}>ตารางข้อมูลการจราจร</h1>

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

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>วันที่</th>
                        <th style={styles.th}>เวลา</th>
                        <th style={styles.th}>ชื่อ</th>
                        <th style={styles.th}>สถานะการจราจร</th>
                        <th style={styles.th}>จำนวนรถ</th>
                        <th style={styles.th}>ความเร็ว</th>
                        <th style={styles.th}>แบตเตอรี่</th>
                        <th style={styles.th}>ประวัติ</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredNodes.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={styles.noData}>
                                ไม่พบข้อมูลที่ค้นหา
                            </td>
                        </tr>
                    ) : (
                        filteredNodes.map((node) => {
                            const dateObj = node.node_datetime?.toDate?.();

                            const date = dateObj
                                ? dateObj.toLocaleDateString("th-TH")
                                : "-";

                            const time = dateObj
                                ? dateObj.toLocaleTimeString("th-TH", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "-";

                            return (
                                <tr key={node.id} style={styles.row}>
                                    <td style={styles.td}>{date}</td>
                                    <td style={styles.td}>{time}</td>
                                    <td style={styles.td}>{node.node_name}</td>
                                    <td
                                        style={{
                                            ...styles.td,
                                            color: getStatusColor(node.node_status),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {node.node_status}
                                    </td>
                                    <td style={styles.td}>{node.node_countcar} คัน/นาที</td>
                                    <td style={styles.td}>{node.node_speed} กม/ชม</td>
                                    <td
                                        style={{
                                            ...styles.td,
                                            color: getBatteryColor(node.node_battery),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {node.node_battery}%
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.historyButton}
                                            onClick={() => openHistory(node.node_id)}
                                            onMouseOver={(e) => e.target.style.backgroundColor = "#1e40af"}
                                            onMouseOut={(e) => e.target.style.backgroundColor = "#1e3a8a"}
                                        >
                                            ดูประวัติ
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            <History
                showModal={showModal}
                logs={logs}
                closeModal={closeModal}
                getStatusColor={getStatusColor}
                getBatteryColor={getBatteryColor}
            />
        </div>
    );
}

const styles = {
    container: {
        padding: "60px 40px",
        minHeight: "100vh",
        backgroundImage: `
            linear-gradient(
                rgba(255, 255, 255, 0.35),
                rgba(255, 255, 255, 0.35)
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
        textShadow: "0px 0px 7px rgb(255, 255, 255)"
    },

    searchBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
    },

    searchInput: {
        width: "300px",
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
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px",
    },

    resetButton: {
        backgroundColor: "#94a3b8",
        color: "white",
        border: "none",
        padding: "10px 16px",
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
        fontWeight: "bold"
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

    historyButton: {
        backgroundColor: "#1e3a8a",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.2s ease-in-out",
    },
};

export default Table;
