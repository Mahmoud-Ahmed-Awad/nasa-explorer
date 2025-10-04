import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Icon from "./UI/Icon";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "leaflet/dist/images/marker-icon.png",
  shadowUrl: "leaflet/dist/images/marker-shadow.png",
});

const SatelliteMap = ({ satellites, selectedSatellite, onSatelliteSelect }) => {
  const [mapCenter] = useState([20, 0]);
  const [mapZoom] = useState(2);

  // Helper function to get icon name based on satellite type
  const getIconName = (type) => {
    switch (type) {
      case "Space Station":
        return "spaceStation";
      case "Earth Observation":
        return "antenna";
      case "Solar Observatory":
        return "sun";
      case "Space Telescope":
        return "telescope";
      case "Near Earth Object":
        return "comet";
      case "Solar Probe":
        return "rocket";
      default:
        return "satellite";
    }
  };

  // Helper function to get emoji/symbol for map markers
  const getMapIconSymbol = (type) => {
    switch (type) {
      case "Space Station":
        return "🏗️";
      case "Earth Observation":
        return "📡";
      case "Solar Observatory":
        return "☀️";
      case "Space Telescope":
        return "🔭";
      case "Near Earth Object":
        return "☄️";
      case "Solar Probe":
        return "🚀";
      default:
        return "🛰️";
    }
  };

  // Create custom satellite icons based on type
  const createSatelliteIcon = (satellite) => {
    const getIconColor = (type) => {
      switch (type) {
        case "Space Station":
          return "linear-gradient(135deg, #00ff88, #00aaff)";
        case "Earth Observation":
          return "linear-gradient(135deg, #ff6b6b, #4ecdc4)";
        case "Solar Observatory":
          return "linear-gradient(135deg, #ffd93d, #ff6b35)";
        case "Space Telescope":
          return "linear-gradient(135deg, #a8e6cf, #88d8c0)";
        case "Near Earth Object":
          return "linear-gradient(135deg, #ff9a9e, #fecfef)";
        case "Solar Probe":
          return "linear-gradient(135deg, #ff9a56, #ff6b6b)";
        default:
          return "linear-gradient(135deg, #00f5ff, #bf00ff)";
      }
    };

    return new L.DivIcon({
      html: `
        <div style="
          background: ${getIconColor(satellite.type)};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 15px rgba(0, 245, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
          ${getMapIconSymbol(satellite.type)}
        </div>
      `,
      className: "custom-satellite-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Get satellite position (in a real app, this would be calculated based on orbital mechanics)
  const getSatellitePosition = (satellite) => {
    // Use the position data from the satellite object
    const position = satellite.position || {};
    return [position.latitude || 0, position.longitude || 0];
  };

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {/* Map Legend */}
      <div className="bg-slate-800/50 rounded-t-lg p-4 border-b border-slate-700">
        <h3 className="text-white font-semibold mb-3">Satellite Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-400"></div>
            <span className="text-slate-300">Space Station</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-cyan-400"></div>
            <span className="text-slate-300">Earth Observation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
            <span className="text-slate-300">Solar Observatory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-300 to-teal-400"></div>
            <span className="text-slate-300">Space Telescope</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
            <span className="text-slate-300">Near Earth Object</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-red-400"></div>
            <span className="text-slate-300">Solar Probe</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Total satellites displayed: {satellites?.length || 0}
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[600px] w-full">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {satellites?.map((satellite) => {
            const position = getSatellitePosition(satellite);
            const icon = createSatelliteIcon(satellite);

            return (
              <Marker key={satellite.id} position={position} icon={icon}>
                <Popup>
                  <div className="p-3 min-w-[250px] max-w-[300px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-2xl">
                        <Icon
                          name={getIconName(satellite.type)}
                          size={24}
                          className="text-slate-800"
                        />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {satellite.name}
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="font-medium text-slate-800">
                          {satellite.type}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span
                          className={`font-medium ${
                            satellite.status === "Active"
                              ? "text-green-600"
                              : satellite.status === "Potentially Hazardous"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {satellite.status}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Altitude:</span>
                        <span className="font-medium text-slate-800">
                          {satellite.altitude
                            ? `${satellite.altitude.toLocaleString()} km`
                            : "Unknown"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Agency:</span>
                        <span className="font-medium text-slate-800">
                          {satellite.agency}
                        </span>
                      </div>

                      {satellite.launchYear && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Launch Year:</span>
                          <span className="font-medium text-slate-800">
                            {satellite.launchYear}
                          </span>
                        </div>
                      )}

                      {satellite.purpose && (
                        <div className="mt-2">
                          <span className="text-slate-400 text-xs">
                            Purpose:
                          </span>
                          <p className="text-slate-700 text-xs mt-1">
                            {satellite.purpose}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        onSatelliteSelect && onSatelliteSelect(satellite)
                      }
                      className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-md"
                    >
                      View Full Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default SatelliteMap;
