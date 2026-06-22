import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useLanguage } from "../languagecontext/useLanguage";
import bgImage from "../../assets/22959.jpg";

const CrudUserAccount = ({ user, onClose }) => {

    const { t: tAll } = useLanguage();
    const t = tAll.userAccount;

    const [memberData, setMemberData] = useState(user || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                const memberRef = doc(db, "Traffic_Mem", user.id);
                const snapshot = await getDoc(memberRef);

                if (snapshot.exists()) {
                    setMemberData({ id: snapshot.id, ...snapshot.data() });
                }
            } catch (error) {
                console.error("Fetch member error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [user]);

    // จุดแทนรหัสผ่านจริง ตามจำนวนความยาวของรหัสผ่านจริง
    const maskedPassword = memberData?.mem_password
        ? "•".repeat(memberData.mem_password.length)
        : "";

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                <div style={styles.header}>
                    <h2 style={styles.title}>{t.title}</h2>
                    <button style={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                {loading ? (
                    <p style={styles.loadingText}>{t.loading}</p>
                ) : !memberData ? (
                    <p style={styles.errorText}>{t.notFound}</p>
                ) : (
                    <div style={styles.infoList}>

                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>
                                <i className="bi bi-person-badge" style={styles.infoIcon}></i>
                                {t.labelRank}
                            </span>
                            <span style={styles.infoValue}>{memberData.mem_rank || "-"}</span>
                        </div>

                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>
                                <i className="bi bi-person" style={styles.infoIcon}></i>
                                {t.labelName}
                            </span>
                            <span style={styles.infoValue}>{memberData.mem_name || "-"}</span>
                        </div>

                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>
                                <i className="bi bi-envelope" style={styles.infoIcon}></i>
                                {t.labelEmail}
                            </span>
                            <span style={styles.infoValue}>{memberData.mem_email || "-"}</span>
                        </div>

                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>
                                <i className="bi bi-lock" style={styles.infoIcon}></i>
                                {t.labelPassword}
                            </span>
                            <span style={styles.infoValue}>{maskedPassword || "-"}</span>
                        </div>

                    </div>
                )}

                <div style={styles.buttonGroup}>
                    <button style={styles.closeBtnFull} onClick={onClose}>
                        {t.closeButton}
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
        zIndex: 1000,
        backgroundImage: `
            linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
            url(${bgImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
    },

    modal: {
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        width: "520px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
    },

    title: {
        fontFamily: "'Prompt', sans-serif",
        margin: 0,
        textAlign: "left",
        fontSize: "26px",
        color: "#111",
    },

    closeButton: {
        background: "transparent",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        color: "#64748b",
        lineHeight: 1,
        padding: "0 4px",
    },

    loadingText: {
        textAlign: "center",
        color: "#64748b",
        padding: "20px 0",
    },

    errorText: {
        textAlign: "center",
        color: "#dc2626",
        fontWeight: "bold",
        padding: "20px 0",
    },

    infoList: {
        display: "flex",
        flexDirection: "column",
        gap: "0px",
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: "1px solid #e5e7eb",
    },

    infoLabel: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#64748b",
        fontSize: "16px",
        fontWeight: "bold",
    },

    infoIcon: {
        fontSize: "17px",
        color: "#1976D2",
    },

    infoValue: {
        color: "#111",
        fontWeight: "bold",
        fontSize: "17px",
        textAlign: "right",
        wordBreak: "break-all",
        marginLeft: "12px",
    },

    buttonGroup: {
        display: "flex",
        justifyContent: "center",
        marginTop: "24px",
    },

    closeBtnFull: {
        width: "100%",
        backgroundColor: "#1976D2",
        color: "white",
        border: "none",
        padding: "14px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily: "'Prompt', sans-serif",
    },
};

export default CrudUserAccount;
