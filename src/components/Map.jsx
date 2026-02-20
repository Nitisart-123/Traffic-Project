import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, OverlayView } from "@react-google-maps/api";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

const mapAPIKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function MapComponent() {
  const [nodes, setNodes] = useState([]);
  const [center, setCenter] = useState(null);
  const [openCards, setOpenCards] = useState([]);

  const handleMarkerClick = (node) => {
    setOpenCards((prev) => {
      const exists = prev.find((item) => item.id === node.id);

      // 🔁 ถ้ามีอยู่แล้ว = ปิด
      if (exists) {
        return prev.filter((item) => item.id !== node.id);
      }

      // 🆕 ถ้ายังไม่มี = เปิด
      return [...prev, node];
    });
  };

  const handleCloseCard = (id) => {
    setOpenCards((prev) => prev.filter((item) => item.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "รถติดหยุดนิ่ง":
      case "รถติดมาก":
        return "#ff0000"; // แดง

      case "รถติดน้อย":
        return "#ffc107"; // เหลือง

      case "รถไหลปกติ":
        return "#28a745"; // เขียว

    }
  };


  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Sensor_Node"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
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
      }
    );

    // 🔥 cleanup ตอน component ถูก unmount
    return () => unsubscribe();
  }, []);


  return (
    <LoadScript googleMapsApiKey={mapAPIKey}>
      {center && (
        <GoogleMap
          mapContainerStyle={{ width: "100vw", height: "100vh" }}
          center={center}
          zoom={19}
          onClick={() => setOpenCards([])}
          options={{
            gestureHandling: "greedy",   // 🔥 ให้ scroll ซูมได้เลย
            scrollwheel: true,
          }}
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
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="50" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
        <path fill="${getStatusColor(node.node_status)}"
          d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
      </svg>
    `)}`,
                  scaledSize: new window.google.maps.Size(40, 50),
                }}
              />


            );
          })}

          {openCards.map((node) => {
            const color = getStatusColor(node.node_status);
            return (
              <OverlayView
                key={node.id}
                position={{
                  lat: parseFloat(node.node_latitude),
                  lng: parseFloat(node.node_longitude),
                }}
                mapPaneName={OverlayView.FLOAT_PANE}
              >
                <div style={styles.cardWrapper}>
                  <div
                    style={{
                      ...styles.card,
                      border: `4px solid ${color}`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >

                    <div
                      style={styles.closeBtn}
                      onClick={() => handleCloseCard(node.id)}
                    >
                      ✕
                    </div>

                    <div style={styles.header}>
                      <div
                        style={{
                          ...styles.redDot,
                          backgroundColor: color,
                        }}
                      ></div>

                      <div style={styles.nodeName}>
                        {node.node_name}
                      </div>
                    </div>

                    <div style={styles.boxData}>
                      <div style={styles.label}>
                        <p>ความเร็วเฉลี่ย</p>
                        <p>จำนวยานพาหนะ</p>
                        <p>สถานะการจราจร</p>
                      </div>

                      <div style={styles.value}>
                        <p>{node.node_speed} กม/ชม</p>
                        <p>{node.node_countcar} คัน/นาที</p>
                        <p style={{ color: color, fontWeight: "bold" }}>
                          {node.node_status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* สามเหลี่ยม */}
                  <div
                    style={{
                      ...styles.arrow,
                      borderTop: `20px solid ${color}`,
                    }}
                  ></div>
                </div>
              </OverlayView>
            );
          })}

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
    padding: "18px 30px",
    borderRadius: "28px",
    border: "4px solid red",
    minWidth: "380px",
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
    width: "30px",
    height: "30px",
    backgroundColor: "red",
    borderRadius: "50%",
    position: "absolute",
    left: 0,
    bottom: 5,
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
    marginTop: "-1px",
  },

  space: {
    padding: "10px",
  },
};

export default MapComponent;
