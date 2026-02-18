import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, OverlayView } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const mapAPIKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function MapComponent() {
  const [nodes, setNodes] = useState([]);
  const [center, setCenter] = useState(null);
  const [openCards, setOpenCards] = useState([]);

  const handleMarkerClick = (node) => {
    setOpenCards((prev) => {
      const exists = prev.find((item) => item.id === node.id);

      if (exists) return prev; // ไม่เปิดซ้ำ

      return [...prev, node];
    });
  };

  const handleCloseCard = (id) => {
    setOpenCards((prev) => prev.filter((item) => item.id !== id));
  };


  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Sensor_Node"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNodes(data);

      if (data.length > 0) {
        const lat = parseFloat(data[0].node_latitude);
        const lng = parseFloat(data[0].node_longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          setCenter({ lat, lng });
        }
      }
    };

    fetchData();
  }, []);

  return (
    <LoadScript googleMapsApiKey={mapAPIKey}>
      {center && (
        <GoogleMap
          mapContainerStyle={{ width: "100vw", height: "100vh" }}
          center={center}
          zoom={18}
        >
          {nodes.map((node) => {
            const lat = parseFloat(node.node_latitude);
            const lng = parseFloat(node.node_longitude);

            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={node.id}
                position={{ lat, lng }}
                onClick={() => handleMarkerClick(node)}
              />

            );
          })}

          {openCards.map((node) => (
            <OverlayView
              key={node.id}
              position={{
                lat: parseFloat(node.node_latitude),
                lng: parseFloat(node.node_longitude),
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div style={styles.cardWrapper}>
                <div style={styles.card}>

                  {/* ปุ่มปิด */}
                  <div
                    style={styles.closeBtn}
                    onClick={() => handleCloseCard(node.id)}
                  >
                    ✕
                  </div>

                  {/* Header */}
                  <div style={styles.header}>
                    <div style={styles.redDot}></div>
                    <div style={styles.nodeName}>
                      {node.node_name}
                    </div>
                  </div>

                  {/* แสดงข้อมูล */}
                  <div style={styles.boxData}>
                    {/* ข้อความ */}
                    <div style={styles.label}>
                      <p>ความเร็วเฉลี่ย</p>
                      <p>จำนวยานพาหนะ</p>
                      <p>สถานะ</p>
                    </div>

                    {/* ข้อมูล */}
                    <div style={styles.value}>
                      <p>{node.node_speed} กม/ชม</p>
                      <p>{node.node_countcar} คัน/นาที</p>
                      <p style={{ color: "red", fontWeight: "bold" }}>{node.node_status}</p>
                    </div>
                  </div>

                </div>
                <div style={styles.arrow}></div>
              </div>
            </OverlayView>
          ))}
        </GoogleMap>
      )}
    </LoadScript>
  );
}

const styles = {
  cardWrapper: {
    position: "relative",
    transform: "translate(-50%, -110%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  card: {
    background: "#f3f3f3",
    padding: "18px 20px",
    borderRadius: "28px",
    border: "4px solid red",
    minWidth: "380px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    position: "relative",
    fontFamily: "Kanit, sans-serif",
  },

  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    fontSize: "22px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "22px",
    position: "relative",
  },

  redDot: {
    width: "16px",
    height: "16px",
    backgroundColor: "red",
    borderRadius: "50%",
    position: "absolute",
    left: 0,
  },

  nodeName: {
    fontSize: "40px",
    fontWeight: "bold",
  },

  boxData: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "22px",
  },

  row: {
    display: "flex",
    justifyContent: "start",
    marginBottom: "14px",
    fontSize: "22px",
  },

  arrow: {
    width: 0,
    height: 0,
    borderLeft: "20px solid transparent",
    borderRight: "20px solid transparent",
    borderTop: "20px solid red",
    marginTop: "0px",
  },
};

export default MapComponent;
