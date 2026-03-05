import React from "react";

function History({ showModal, logs, closeModal, getStatusColor, getBatteryColor }) {

    if (!showModal) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>

                <div style={styles.modalHeader}>
                    <h2>ประวัติย้อนหลัง</h2>
                    <button
                        style={styles.closeIcon}
                        onClick={closeModal}
                    >
                        ✕
                    </button>
                </div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>วันที่</th>
                                <th style={styles.th}>เวลา</th>
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
                                    ? dateObj.toLocaleDateString("th-TH")
                                    : "-";

                                const time = dateObj
                                    ? dateObj.toLocaleTimeString("th-TH", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit"
                                    })
                                    : "-";

                                return (
                                    <tr key={log.id}>
                                        <td style={styles.td}>{date}</td>
                                        <td style={styles.td}>{time}</td>
                                        <td style={styles.td}>{log.log_countcar} คัน/นาที</td>
                                        <td style={styles.td}>{log.log_speed} กม/ชม</td>

                                        <td
                                            style={{
                                                ...styles.td,
                                                color: getStatusColor(log.log_status),
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {log.log_status}
                                        </td>

                                        <td
                                            style={{
                                                ...styles.td,
                                                color: getBatteryColor(log.log_battery),
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {log.log_battery}%
                                        </td>
                                    </tr>
                                );

                            })}
                        </tbody>
                    </table>
                </div>

                <div style={styles.modalFooter}>
                    <button
                        style={styles.closeButton}
                        onClick={closeModal}
                    >
                        ปิด
                    </button>
                </div>

            </div>
        </div>
    );
}

const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        overflowY: "auto"
    },

    modal: {
        width: "85%",
        maxHeight: "75vh",
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
    },

    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        zIndex: 10,
        marginBottom: "10px",
    },

    tableWrapper: {
        flex: 1,
        overflowY: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "18px",
    },

    th: {
        padding: "16px",
        backgroundColor: "#f1f5f9",
        textAlign: "center",
    },

    td: {
        padding: "16px",
        textAlign: "center",
    },

    modalFooter: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px",
    },

    closeButton: {
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    closeIcon: {
        background: "transparent",
        border: "none",
        fontSize: "22px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default History;