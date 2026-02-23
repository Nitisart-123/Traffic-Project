import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const mapAPIKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapAPIKey,
  });

  const [nodes, setNodes] = useState([]);
  const [center, setCenter] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "รถติดหยุดนิ่ง":
      case "รถติดมาก":
        return "#ff0000";
      case "รถติดน้อย":
        return "#ffc107";
      case "รถไหลปกติ":
        return "#28a745";
      default:
        return "#999";
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

    return () => unsubscribe();
  }, []);

  if (!isLoaded || !center) return null;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100vw", height: "100vh" }}
      center={center}
      zoom={19}
      onClick={() => setSelectedNode(null)}
      options={{
        gestureHandling: "greedy",
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
      }}
    >
      {/* ---------- MARKER ---------- */}
      {nodes.map((node) => {
        const lat = parseFloat(node.node_latitude);
        const lng = parseFloat(node.node_longitude);
        if (isNaN(lat) || isNaN(lng)) return null;

        const color = getStatusColor(node.node_status);

        return (
          <Marker
            key={node.id}
            position={{ lat, lng }}
            onClick={() => setSelectedNode(node)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="40" height="50" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
                  <path fill="${color}"
                    d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"/>
                  <circle cx="12" cy="12" r="5" fill="white"/>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(40, 50),
            }}
          />
        );
      })}

      {/* ---------- INFO WINDOW ---------- */}
      {selectedNode && (() => {
        const lat = parseFloat(selectedNode.node_latitude);
        const lng = parseFloat(selectedNode.node_longitude);
        const color = getStatusColor(selectedNode.node_status);

        return (
          <InfoWindow
            position={{ lat, lng }}
            onCloseClick={() => setSelectedNode(null)}
            options={{
              disableAutoPan: true,
              pixelOffset: new window.google.maps.Size(0, -30),
            }}
          >
            <div
              style={{
                ...styles.card,
                border: `5px solid ${color}`,
              }}
            >
              {/* ปุ่ม X */}


              {/* Header */}
              <div style={styles.header}>
                <div
                  style={{
                    ...styles.dot,
                    backgroundColor: color,
                  }}
                />
                <div style={styles.nodeName}>
                  {selectedNode.node_name}
                </div>
                <div
                  style={styles.closeBtn}
                  onClick={() => setSelectedNode(null)}
                >
                  ✕
                </div>
              </div>

              {/* Data Row */}
              <div style={styles.dataRow}>
                <div style={styles.label}>
                  <p>ความเร็วเฉลี่ย</p>
                  <p>จำนวนยานพาหนะ</p>
                  <p>สถานะการจราจร</p>
                </div>

                <div style={styles.value}>
                  <p>
                    <span style={styles.valueStyle}>{selectedNode.node_speed}</span>
                    กม/ชม
                  </p>
                  <p>
                    <span style={styles.valueStyle}>{selectedNode.node_countcar}</span>
                    คัน/นาที
                  </p>
                  <p
                    style={{
                      color: color,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedNode.node_status}
                  </p>
                </div>
              </div>
            </div>
          </InfoWindow>
        );
      })()}
    </GoogleMap>
  );
}

const styles = {
  card: {
    background: "#f3f3f3",
    padding: "10px 40px",   // เดิม 40px 50px
    borderRadius: "35px",
    minWidth: "480px",
    fontFamily: "Kanit, sans-serif",
    position: "relative",
  },

  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "25px",

  },

  label: {
    display: "flex",
    flexDirection: "column",
  },

  value: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },

  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "0px",
    fontSize: "26px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",   // เดิม 40px
    position: "relative",
  },

  dot: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    position: "absolute",
    left: "0px",
    top: "15px",
  },

  nodeName: {
    fontSize: "42px",
    fontWeight: "bold",
    textAlign: "center",
  },

  labelStyle: {
    margin: 0,
  },
  valueStyle: {
    padding: "0px 20px 0px 0px",
    fontWeight: "bold",
  }
};

export default Map;