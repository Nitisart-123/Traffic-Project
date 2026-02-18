import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, OverlayView } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const mapAPIKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function MapComponent() {
  const [nodes, setNodes] = useState([]);
  const [center, setCenter] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);


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
                onClick={() => setSelectedNode(node)}
              />
            );
          })}

          {selectedNode && (
            <OverlayView
              position={{
                lat: parseFloat(selectedNode.node_latitude),
                lng: parseFloat(selectedNode.node_longitude),
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div style={styles.cardWrapper}>
                <div style={styles.card}>
                  <h2>{selectedNode.node_name}</h2>

                  <p>
                    ความเร็ว: {selectedNode.node_speed} km/h
                  </p>

                  <p>
                    จำนวนรถ: {selectedNode.node_countcar} n / 10 m
                  </p>

                  <p>
                    การจราจร:{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {selectedNode.node_status}
                    </span>
                  </p>
                </div>

                <div style={styles.arrow}></div>
              </div>
            </OverlayView>
          )}


        </GoogleMap>
      )}
    </LoadScript>
  );
}

const styles = {
  cardWrapper: {
    position: "relative",
    transform: "translate(-50%, -120%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",   // 👈 ทำให้ arrow อยู่กึ่งกลาง
  },

  card: {
    background: "#f3f3f3",
    padding: "20px",
    borderRadius: "30px",
    border: "4px solid red",
    minWidth: "320px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  arrow: {
    width: 0,
    height: 0,
    borderLeft: "18px solid transparent",
    borderRight: "18px solid transparent",
    borderTop: "18px solid red",
    marginTop: "-4px",  // 👈 ดึงชิดการ์ด
  },

};



export default MapComponent;
