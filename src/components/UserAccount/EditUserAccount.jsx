import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useLanguage } from "../languagecontext/useLanguage";

const EditUserAccount = ({ memberData, onClose, onSuccess }) => {

    const { t: tAll } = useLanguage();
    const t = tAll.editUserAccount;

    const [rank, setRank] = useState(memberData?.mem_rank || "");
    const [name, setName] = useState(memberData?.mem_name || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const handleUpdate = async () => {

        setErrorMessage("");

        // ===== ข้อมูลพื้นฐานต้องไม่ว่าง =====
        if (!rank.trim() || !name.trim()) {
            setErrorMessage(t.errorRequired);
            return;
        }

        // ===== ถ้าต้องการเปลี่ยนรหัสผ่าน ต้องกรอกรหัสเดิมก่อน =====
        const wantsPasswordChange = newPassword || confirmPassword || oldPassword;

        if (wantsPasswordChange) {
            if (!oldPassword) {
                setErrorMessage(t.errorOldPasswordRequired);
                return;
            }

            if (oldPassword !== memberData?.mem_password) {
                setErrorMessage(t.errorOldPasswordIncorrect);
                return;
            }

            if (!newPassword || !confirmPassword) {
                setErrorMessage(t.errorRequired);
                return;
            }

            if (newPassword !== confirmPassword) {
                setErrorMessage(t.errorPasswordMismatch);
                return;
            }
        }

        try {
            setSaving(true);

            const memberRef = doc(db, "Traffic_Mem", memberData.id);

            const updateData = {
                mem_name: name,
                mem_rank: rank,
            };

            if (wantsPasswordChange) {
                updateData.mem_password = newPassword;
            }

            await updateDoc(memberRef, updateData);

            onSuccess({ ...memberData, ...updateData });

        } catch (error) {
            console.error("Update member error:", error);
            setErrorMessage(t.errorUpdateFailed);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                <div style={styles.header}>
                    <h2 style={styles.title}>{t.title}</h2>
                    <button style={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                {errorMessage && (
                    <div style={styles.errorText}>{errorMessage}</div>
                )}

                <div style={styles.body}>

                    <label style={styles.label}>{t.labelRank}</label>
                    <input
                        style={styles.input}
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                    />

                    <label style={styles.label}>{t.labelName}</label>
                    <input
                        style={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div style={styles.divider} />

                    <p style={styles.passwordHint}>{t.passwordHint}</p>

                    <label style={styles.label}>{t.labelOldPassword}</label>
                    <input
                        type="password"
                        style={styles.input}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder={t.placeholderOldPassword}
                    />

                    <label style={styles.label}>{t.labelNewPassword}</label>
                    <input
                        type="password"
                        style={styles.input}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t.placeholderNewPassword}
                    />

                    <label style={styles.label}>{t.labelConfirmPassword}</label>
                    <input
                        type="password"
                        style={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.placeholderConfirmPassword}
                    />

                </div>

                <div style={styles.buttonGroup}>
                    <button
                        style={styles.saveButton}
                        onClick={handleUpdate}
                        disabled={saving}
                    >
                        {saving ? t.saving : t.saveButton}
                    </button>

                    <button style={styles.cancelButton} onClick={onClose}>
                        {t.cancelButton}
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
        zIndex: 1100,
    },

    modal: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        width: "380px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
        overflowY: "auto",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },

    title: {
        fontFamily: "'Prompt', sans-serif",
        margin: 0,
        textAlign: "left",
        fontSize: "20px",
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

    body: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    label: {
        marginTop: "10px",
        marginBottom: "5px",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#333",
    },

    input: {
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "14px",
    },

    divider: {
        height: "1px",
        backgroundColor: "#e5e7eb",
        margin: "10px 0",
    },

    passwordHint: {
        fontSize: "13px",
        color: "#64748b",
        margin: "0 0 4px 0",
    },

    buttonGroup: {
        display: "flex",
        justifyContent: "end",
        marginTop: "20px",
        gap: "10px",
    },

    saveButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer",
        fontFamily: "'Prompt', sans-serif",
        fontWeight: "bold",
    },

    cancelButton: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer",
        fontFamily: "'Prompt', sans-serif",
        fontWeight: "bold",
    },

    errorText: {
        color: "red",
        marginBottom: "10px",
        fontWeight: "bold",
        fontSize: "14px",
    },
};

export default EditUserAccount;
