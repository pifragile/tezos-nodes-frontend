import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import './fixLeafletIcons.jsx'

const NodeLocationsMap = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(
                    "https://api.pigu.ch/tezos/node-locations"
                );
                const data = await response.json();
                const parsed = data
                    .map((entry) => {
                        const loc = entry.raw.loc;
                        if (!loc) return null;
                        const [lat, lng] = loc.split(",").map(Number);
                        return {
                            lat,
                            lng,
                            city: entry.raw.city,
                            country: entry.raw.country,
                            ip: entry.raw.ip,
                            org: entry.raw.org,
                        };
                    })
                    .filter(Boolean);
                console.log(parsed);
                setLocations(parsed);
            } catch (err) {
                console.error("Error fetching node locations:", err);
            }
        };

        fetchLocations();
    }, []);

    return (
        <MapContainer
            center={[20, 0]}
            zoom={2.5}
            minZoom={2}
            style={{ width: "100vw", height: "100vh" }}
            maxBounds={[
                [60, -180],
                [-60, 180],
            ]}
            maxBoundsViscosity={1.0}
            worldCopyJump={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                noWrap={true}
            />
            {locations.map((loc, idx) => (
                <Marker key={idx} position={[loc.lat, loc.lng]}>
                    <Popup>
                        <strong>{loc.ip}</strong>
                        <br />
                        {loc.city}, {loc.country}
                        <br />
                        {loc.org}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default NodeLocationsMap;
