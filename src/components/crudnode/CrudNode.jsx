import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import bgImage from "../../assets/22959.jpg";

const CrudNode = () => {

    const [nodes, setNodes] = useState([]);

    // ฟังก์ชันดึงข้อมูล

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

            const querySnapshot = await getDocs(collection(db, "Sensor_Node"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setNodes(data);
        }
    };


    return (
        <div
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                minHeight: "100vh",
            }}
        >

            {/* Navbar */}
            <nav
                style={{
                    backgroundColor: "#2c3e50",
                    padding: "15px",
                    color: "white",
                    fontSize: "20px",
                }}
            >
                ระบบจัดการโหนดเซนเซอร์
            </nav>

            <div style={{ padding: "40px" }}>

                {/* ปุ่มเพิ่ม */}
                <div style={{ textAlign: "right", marginBottom: "10px" }}>
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#27ae60",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                        }}
                    >
                        เพิ่มข้อมูล
                    </button>
                </div>

                {/* ตาราง */}
                <table
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead style={{ backgroundColor: "#34495e", color: "white" }}>
                        <tr>
                            <th style={{ padding: "10px" }}>Node ID</th>
                            <th>Node Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>แก้ไข</th>
                            <th>ลบ</th>
                        </tr>
                    </thead>

                    <tbody>
                        {nodes.map((node) => (
                            <tr key={node.id} style={{ textAlign: "center" }}>
                                <td>{node.node_id}</td>
                                <td>{node.node_name}</td>
                                <td>{node.node_latitude}</td>
                                <td>{node.node_longitude}</td>

                                <td>
                                    <button
                                        style={{
                                            backgroundColor: "#f39c12",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        แก้ไข
                                    </button>
                                </td>

                                <td>
                                    <button
                                        onClick={() => deleteNode(node.id)}
                                        style={{
                                            backgroundColor: "#e74c3c",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CrudNode;