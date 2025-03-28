import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FaMapMarkerAlt,
  FaHospitalSymbol,
  FaShieldAlt,
  FaMedkit,
  FaSyncAlt,
  FaSatellite,
  FaExclamationTriangle,
  FaList,
  FaMap
} from 'react-icons/fa';

// Custom Icons
const icons = {
  hospital: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  police: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  pharmacy: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

// Function to calculate the distance between two locations
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [resources, setResources] = useState([]);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [satelliteView, setSatelliteView] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'list' or 'map'

  // Fetch resources from Overpass API
  const fetchResources = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];
         (
           node[amenity=hospital](around:2000,${lat},${lng});
           node[amenity=police](around:2000,${lat},${lng});
           node[amenity=pharmacy](around:2000,${lat},${lng});
         );
         out body;>;out skel qt;`
      );
      const data = await response.json();
      const results = data.elements
        .filter((el) => el.tags && el.tags.name)
        .map((el) => ({
          id: el.id,
          name: el.tags.name,
          type: el.tags.amenity,
          lat: el.lat,
          lon: el.lon,
          distance: calculateDistance(lat, lng, el.lat, el.lon),
        }))
        .sort((a, b) => a.distance - b.distance); // Sort by nearest

      setResources(results);
    } catch (err) {
      setError('Failed to fetch resources. Try again later.');
      console.error(err);
    }
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          fetchResources(latitude, longitude);
        },
        (err) => {
          setError('Location access denied. Enable location and reload.');
          console.error(err);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported in this browser.');
    }
  }, []);

  // Filtered search results
  const filteredResources = resources.filter(
    (res) =>
      (filter === 'All' || res.type === filter) &&
      res.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigation function
  const handleNavigation = (lat, lon) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-purple-600">Resource Finder</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-lg">
          <FaExclamationTriangle className="inline-block mr-2" />
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Search resources..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-lg mb-4 text-purple-600"
      />
      
      <select
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
        className="border border-gray-300 rounded-md py-2 px-3 text-purple-600 w-full max-w-lg mb-4"
      >
        <option value="All">All Types</option>
        <option value="hospital">Hospitals</option>
        <option value="police">Police Stations</option>
        <option value="pharmacy">Pharmacies</option>
      </select>

      {/* View Mode Toggle */}
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setViewMode('map')} className="bg-purple-600 text-white px-4 py-2 rounded-md">
          <FaMap className="inline-block mr-2" /> Map View
        </button>
        <button onClick={() => setViewMode('list')} className="bg-gray-600 text-white px-4 py-2 rounded-md">
          <FaList className="inline-block mr-2" /> List View
        </button>
      </div>

      {/* Map View */}
      {viewMode === 'map' && position && (
        <MapContainer center={position} zoom={15} className="h-96 w-full max-w-3xl rounded-lg overflow-hidden shadow-lg">
          <TileLayer url={satelliteView ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
          <Marker position={position} icon={icons.police}>
            <Popup>Your Location</Popup>
          </Marker>
          {filteredResources.map((res) => (
            <Marker key={res.id} position={[res.lat, res.lon]} icon={icons[res.type]}>
              <Popup>{res.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default ResourceHub;
