import React, { useState, useMemo } from "react";

function History({ showModal, logs, closeModal, getStatusColor, getBatteryColor }) {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchedStart, setSearchedStart] = useState("");
    const [searchedEnd, setSearchedEnd] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        setSearchedStart(startDate);
        setSearchedEnd(endDate);
        setHasSearched(true);
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setSearchedStart("");
        setSearchedEnd("");
        setHasSearched(false);
    };

    const filteredLogs = useMemo(() => {
        if (!hasSearched || (!searchedStart && !searchedEnd)) return logs;

        return logs.filter((log) => {
            const dateObj = log.log_datetime?.toDate?.();
            if (!dateObj) return false;

            // แปลงเป็น string "YYYY-MM-DD" โดยใช้เวลาท้องถิ่น หลีกเลี่ยงปัญหา UTC timezone
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
            const dd = String(dateObj.getDate()).padStart(2, "0");
            const logDateStr = `${yyyy}-${mm}-${dd}`;

            if (searchedStart && logDateStr < searchedStart) return false;
            if (searchedEnd && logDateStr > searchedEnd) return false;

            return true;
        });
    }, [logs, searchedStart, searchedEnd, hasSearched]);

    if (!showModal) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>

                <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>ประวัติย้อนหลัง</h2>
                    <button style={styles.closeIcon} onClick={closeModal}>✕</button>
                </div>

                {/* ===== Search Box ===== */}
                <div style={styles.searchBox}>
                    <div style={styles.dateGroup}>
                        <label style={styles.label}>วันที่เริ่มต้น</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={styles.dateInput}
                        />
                    </div>

                    <span style={styles.dateSeparator}>—</span>

                    <div style={styles.dateGroup}>
                        <label style={styles.label}>วันที่สิ้นสุด</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={styles.dateInput}
                        />
                    </div>

                    <button style={styles.searchButton} onClick={handleSearch}>
                        ค้นหา
                    </button>

                    <button style={styles.resetButton} onClick={handleReset}>
                        รีเซ็ต
                    </button>
                </div>

                {/* ===== Table ===== */}
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
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={styles.emptyCell}>
                                        ไม่พบข้อมูลในช่วงวันที่ที่เลือก
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => {
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
                                        <tr key={log.id} style={styles.tr}>
                                            <td style={styles.td}>{date}</td>
                                            <td style={styles.td}>{time}</td>
                                            <td style={styles.td}>{log.log_countcar} คัน/นาที</td>
                                            <td style={styles.td}>{log.log_speed} กม/ชม</td>
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
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={styles.modalFooter}>
                    <button style={styles.closeButton} onClick={closeModal}>
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
        maxHeight: "80vh",
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
        marginBottom: "14px",
    },

    modalTitle: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "bold",
    },

    searchBox: {
        display: "flex",
        gap: "12px",
        marginBottom: "10px",
        alignItems: "flex-end",
        flexWrap: "wrap",
        backgroundColor: "#f8fafc",
        padding: "14px 16px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
    },

    dateGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    label: {
        fontSize: "13px",
        color: "#64748b",
        fontWeight: "600",
    },

    dateInput: {
        padding: "8px 10px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        outline: "none",
        cursor: "pointer",
        color: "#1e293b",
    },

    dateSeparator: {
        fontSize: "20px",
        color: "#94a3b8",
        paddingBottom: "6px",
    },

    searchButton: {
        backgroundColor: "#1976D2",
        color: "white",
        border: "none",
        padding: "9px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px",
        alignSelf: "flex-end",
        transition: "background 0.2s",
    },

    resetButton: {
        backgroundColor: "#94a3b8",
        color: "white",
        border: "none",
        padding: "9px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px",
        alignSelf: "flex-end",
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
        position: "sticky",
        top: 0,
        zIndex: 1,
    },

    tr: {
        borderBottom: "1px solid #f1f5f9",
    },

    td: {
        padding: "16px",
        textAlign: "center",
    },

    emptyCell: {
        padding: "40px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "16px",
    },

    modalFooter: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "16px",
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
