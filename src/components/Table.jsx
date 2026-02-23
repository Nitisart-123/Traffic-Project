import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import bgImage from "../assets/22959.jpg";

function Table() {
    const [nodes, setNodes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [logs, setLogs] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "Sensor_Node"),
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // เรียงใหม่สุดก่อน
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
        if (battery > 30) return "#c9b400";
        return "#dc2626";
    };

    const getStatusColor = (status) => {
        if (status === "รถติดหยุดนิ่ง" || status === "รถติดมาก")
            return "#dc2626"; // แดง
        if (status === "รถติดน้อย")
            return "#eab308"; // เหลือง
        if (status === "รถไหลปกติ")
            return "#16a34a"; // เขียว
        return "#000";
    };

    const openHistory = (nodeId) => {
        setSelectedNode(nodeId);
        setShowModal(true);

        const q = query(
            collection(db, "Sensor_Log"),
            where("node_id", "==", nodeId)
        );

        onSnapshot(q, (snapshot) => {
            const logData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // เรียงใหม่สุดก่อน
            logData.sort((a, b) =>
                b.log_datetime?.seconds - a.log_datetime?.seconds
            );

            setLogs(logData);
        });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>ตารางข้อมูลการจราจร</h1>

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
                    {nodes.map((node) => {
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
                                <td style={styles.td}>{node.node_countcar} คัน</td>
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
                                    >
                                        ดูประวัติ
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>ประวัติย้อนหลัง (Node: {selectedNode})</h2>

                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>วันที่</th>
                                    <th style={styles.th}>จำนวนรถ</th>
                                    <th style={styles.th}>ความเร็ว</th>
                                    <th style={styles.th}>สถานะ</th>
                                    <th style={styles.th}>แบตเตอรี่</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((log) => {
                                    const dateObj = log.log_datetime?.toDate?.();

                                    const date = dateObj
                                        ? dateObj.toLocaleString("th-TH")
                                        : "-";

                                    return (
                                        <tr key={log.id}>
                                            <td style={styles.td}>{date}</td>
                                            <td style={styles.td}>{log.log_countcar}</td>
                                            <td style={styles.td}>{log.log_speed}</td>
                                            <td style={{
                                                ...styles.td,
                                                color: getStatusColor(log.log_status),
                                                fontWeight: "bold"
                                            }}>
                                                {log.log_status}
                                            </td>
                                            <td style={{
                                                ...styles.td,
                                                color: getBatteryColor(log.log_battery),
                                                fontWeight: "bold"
                                            }}>
                                                {log.log_battery}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <button
                            style={styles.closeButton}
                            onClick={() => setShowModal(false)}
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}
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
        textAlign: "center",
        marginBottom: "40px",
        fontSize: "36px",       // ขยายหัวข้อ
        fontWeight: "bold",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        marginTop: "30px",
        marginBottom: "40px",   // เพิ่มระยะล่าง
        fontSize: "18px",       // ขยายตัวอักษรในตาราง
    },

    th: {
        padding: "16px 12px",
        backgroundColor: "#f1f5f9",
        fontWeight: "bold",
        textAlign: "center",   // 👈 เพิ่ม
    },

    td: {
        padding: "16px 12px",
        textAlign: "center",   // 👈 เพิ่ม
    },

    row: {
        borderBottom: "1px solid #ddd",
    },
};

export default Table;