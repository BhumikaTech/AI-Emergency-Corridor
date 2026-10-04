import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// ==========================================
// AUTOMATICALLY FIT MAP TO ROUTE
// ==========================================

function MapView({
  sourceCoordinates,
  destinationCoordinates,
  routeCoordinates,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      routeCoordinates &&
      routeCoordinates.length > 1
    ) {
      const bounds = L.latLngBounds(routeCoordinates);

      map.fitBounds(bounds, {
        padding: [50, 50],
      });

      return;
    }

    if (
      sourceCoordinates &&
      destinationCoordinates
    ) {
      const bounds = L.latLngBounds([
        [
          sourceCoordinates.lat,
          sourceCoordinates.lon,
        ],
        [
          destinationCoordinates.lat,
          destinationCoordinates.lon,
        ],
      ]);

      map.fitBounds(bounds, {
        padding: [50, 50],
      });
    }
  }, [
    sourceCoordinates,
    destinationCoordinates,
    routeCoordinates,
    map,
  ]);

  return null;
}


// ==========================================
// EMERGENCY MAP
// ==========================================

function EmergencyMap({
  sourceCoordinates,
  destinationCoordinates,
  routeCoordinates = [],
}) {
  const defaultCenter = [
    30.3398,
    76.3869,
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
        overflow: "hidden",
        marginTop: "20px",
        position: "relative",
      }}
    >

      {/* ==================================
          MAP
      ================================== */}

      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapView
          sourceCoordinates={
            sourceCoordinates
          }
          destinationCoordinates={
            destinationCoordinates
          }
          routeCoordinates={
            routeCoordinates
          }
        />

        {/* ==================================
            SOURCE MARKER
        ================================== */}

        {sourceCoordinates && (
          <Marker
            position={[
              sourceCoordinates.lat,
              sourceCoordinates.lon,
            ]}
          >
            <Popup>

              <strong>
                🚑 Emergency Source
              </strong>

              <br />

              Current Location

            </Popup>
          </Marker>
        )}

        {/* ==================================
            DESTINATION MARKER
        ================================== */}

        {destinationCoordinates && (
          <Marker
            position={[
              destinationCoordinates.lat,
              destinationCoordinates.lon,
            ]}
          >
            <Popup>

              <strong>
                🏥 Destination
              </strong>

              <br />

              Emergency Destination

            </Popup>
          </Marker>
        )}

        {/* ==================================
            REAL ROAD ROUTE
        ================================== */}

        {routeCoordinates &&
          routeCoordinates.length > 1 && (
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "red",
                weight: 6,
                opacity: 0.85,
              }}
            />
          )}

      </MapContainer>


      {/* ==================================
          ROUTE STATUS PANEL
      ================================== */}

      {routeCoordinates &&
        routeCoordinates.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              zIndex: 1000,
              background: "white",
              padding: "14px 18px",
              borderRadius: "10px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.2)",
              minWidth: "190px",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >

              <span
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#16a34a",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              ></span>

              <strong>
                Route Active
              </strong>

            </div>


            <div
              style={{
                fontSize: "13px",
                color: "#555",
                lineHeight: "1.7",
              }}
            >

              <div>
                🚑 Emergency Source
              </div>

              <div>
                🏥 Destination
              </div>

              <div>
                🛣️ Real Road Corridor
              </div>

            </div>

          </div>
        )}

    </div>
  );
}

export default EmergencyMap;