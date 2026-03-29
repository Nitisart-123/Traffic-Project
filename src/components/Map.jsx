import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const mapAPIKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapAPIKey,
  });

  const mapRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [center, setCenter] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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



  const suggestions = searchText.trim()
    ? nodes.filter((node) =>
        node.node_name?.toLowerCase().includes(searchText.trim().toLowerCase())
      )
    : [];

  const goToNode = (node) => {
    const lat = parseFloat(node.node_latitude);
    const lng = parseFloat(node.node_longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(19);
    }

    setSelectedNode(node);
    setSearchText(node.node_name);
    setShowSuggestions(false);
    setSearchError("");
  };

  const handleSearch = () => {
    setSearchError("");
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return;

    const found = nodes.find((node) =>
      node.node_name?.toLowerCase().includes(keyword)
    );

    if (!found) {
      setSearchError("ไม่พบชื่อที่ค้นหา");
      setShowSuggestions(false);
      return;
    }

    goToNode(found);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const hasDropdown = showSuggestions && suggestions.length > 0;
  const hasError = showSuggestions && searchText.trim() && suggestions.length === 0 && searchError;

  if (!isLoaded || !center) return null;

  return (
    <div style={{ position: "relative" }}>

      {/* ===== Search Box ===== */}
      <div style={styles.searchContainer}>
        <div style={{
          ...styles.searchBox,
          borderRadius: (hasDropdown || hasError) ? "12px 12px 0 0" : "12px",
        }}>
          <input
            type="text"
            placeholder="ค้นหาชื่อถนน..."
            value={searchText}
            onChange={(e) => {
              const val = e.target.value;
              setSearchText(val);
              setShowSuggestions(true);
              if (val.trim()) {
                const found = nodes.some((node) =>
                  node.node_name?.toLowerCase().includes(val.trim().toLowerCase())
                );
                setSearchError(found ? "" : "ไม่พบชื่อที่ค้นหา");
              } else {
                setSearchError("");
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            style={styles.searchInput}
          />
          {searchText && (
            <button
              style={styles.clearButton}
              onClick={() => {
                setSearchText("");
                setSearchError("");
                setShowSuggestions(false);
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {hasDropdown && (
          <div style={styles.dropdown}>
            {suggestions.map((node) => (
              <div
                key={node.id}
                style={styles.suggestionItem}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                onClick={() => goToNode(node)}
              >
                <span style={styles.suggestionText}>{node.node_name}</span>
                <span style={{
                  ...styles.suggestionDot,
                  backgroundColor: getStatusColor(node.node_status),
                }} />
              </div>
            ))}
          </div>
        )}

        {hasError && (
          <div style={styles.dropdownError}>ไม่พบชื่อที่ค้นหา</div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={{ width: "100vw", height: "100vh" }}
        center={center}
        zoom={19}
        onClick={() => {
          setSelectedNode(null);
          setShowSuggestions(false);
        }}
        onLoad={(map) => { mapRef.current = map; }}
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
              <div style={{ ...styles.card, border: `5px solid ${color}` }}>
                <div style={styles.header}>
                  <div style={{ ...styles.dot, backgroundColor: color }} />
                  <div style={styles.nodeName}>{selectedNode.node_name}</div>
                  <div style={styles.closeBtn} onClick={() => setSelectedNode(null)}>✕</div>
                </div>

                <div style={styles.dataRow}>
                  <div style={styles.label}>
                    <p>ความเร็วเฉลี่ย</p>
                    <p>จำนวนรถ</p>
                    <p>สถานะการจราจร</p>
                  </div>
                  <div style={styles.value}>
                    <p><span style={styles.valueStyle}>{selectedNode.node_speed}</span>กม/ชม</p>
                    <p><span style={styles.valueStyle}>{selectedNode.node_countcar}</span>คัน/นาที</p>
                    <p style={{ color: color, fontWeight: "bold" }}>{selectedNode.node_status}</p>
                  </div>
                </div>
              </div>
            </InfoWindow>
          );
        })()}
      </GoogleMap>
    </div>
  );
}

const styles = {
  searchContainer: {
    position: "absolute",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    width: "360px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "white",
    padding: "10px 14px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },


  searchInput: {
    flex: 1,
    padding: "4px 0",
    fontSize: "16px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "#1e293b",
  },

  clearButton: {
    background: "transparent",
    border: "none",
    color: "#64748b",
    fontSize: "16px",
    cursor: "pointer",
    padding: "0 4px",
    flexShrink: 0,
  },


  dropdown: {
    backgroundColor: "white",
    borderTop: "1px solid #e2e8f0",
    borderRadius: "0 0 12px 12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },

  suggestionItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    cursor: "pointer",
    backgroundColor: "white",
    transition: "background 0.15s",
  },

  suggestionIcon: {
    fontSize: "15px",
    color: "#64748b",
    flexShrink: 0,
  },

  suggestionText: {
    flex: 1,
    fontSize: "16px",
    color: "#1e293b",
  },

  suggestionDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },

  dropdownError: {
    backgroundColor: "white",
    borderTop: "1px solid #e2e8f0",
    borderRadius: "0 0 12px 12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    padding: "14px 16px",
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: "15px",
    textAlign: "center",
  },

  card: {
    background: "#f3f3f3",
    padding: "10px 40px",
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

  label: { display: "flex", flexDirection: "column" },
  value: { display: "flex", flexDirection: "column", textAlign: "left" },

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
    marginBottom: "15px",
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
    fontFamily: "'Prompt', sans-serif",  // 🔥 ใส่ตรงนี้
    fontSize: "42px",
    fontWeight: "bold",
    textAlign: "center",
  },

  valueStyle: {
    padding: "0px 20px 0px 0px",
    fontWeight: "bold",
  },
};

export default Map;
