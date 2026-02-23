import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function Table() {
    const [nodes, setNodes] = useState([]);

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
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        padding: "60px 40px",   // เพิ่มระยะบนล่าง
        background: "#f5f5f5",
        minHeight: "100vh",
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