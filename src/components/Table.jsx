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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ตารางข้อมูลการจราจร</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>เวลา</th>
            <th>ชื่อ</th>
            <th>สถานะการจราจร</th>
            <th>จำนวนรถ</th>
            <th>ความเร็ว</th>
            <th>แบตเตอรี่</th>
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
                <td>{date}</td>
                <td>{time}</td>
                <td>{node.node_name}</td>
                <td>{node.node_status}</td>
                <td>{node.node_countcar} คัน</td>
                <td>{node.node_speed} km/h</td>
                <td
                  style={{
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
    padding: "40px",
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },
  row: {
    borderBottom: "1px solid #ddd",
  },
};

export default Table;