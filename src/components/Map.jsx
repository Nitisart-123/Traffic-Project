import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
const mapAPIKey  = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function MapComponent() {
  const [nodes, setNodes] = useState([]);
  const [center, setCenter] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "Sensor_Node"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNodes(data);

    // แสดงพิกัดเริ่มต้น
    if (data.length > 0) {
      setCenter({
        lat: parseFloat(data[0].node_latitude),
        lng: parseFloat(data[0].node_longitude),
      });
    }
  };

  fetchData();
}, []);


  return (
    <LoadScript googleMapsApiKey= {mapAPIKey}>
      {center && (
        <GoogleMap
          mapContainerStyle={{ width: "100vw", height: "100vh" }}
          center={center}
          zoom={18}
        >
          {nodes.map((node) => (
            <Marker
              key={node.id}
              position={{
                lat: parseFloat(node.node_latitude),
                lng: parseFloat(node.node_longitude),
              }}
            />
          ))}
        </GoogleMap>
      )}
    </LoadScript>
  );
}

export default MapComponent;
