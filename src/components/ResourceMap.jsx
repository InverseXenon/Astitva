// src/components/ResourceMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaHospitalSymbol, 
  FaShieldAlt, 
  FaMedkit, 
  FaSyncAlt, 
  FaSatellite,
  FaWalking,
  FaCar,
  FaDirections,
  FaClock,
  FaInfoCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'custom-marker'
  });
};

export default function ResourceMap() {
  const [position, setPosition] = useState(null);
  const [nearestLocations, setNearestLocations] = useState({ 
    hospital: null, 
    police: null,
    pharmacy: null
  });
  const [otherLocations, setOtherLocations] = useState({ 
    hospital: [],
    police: [],
    pharmacy: []
  });
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [satelliteView, setSatelliteView] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showLegend, setShowLegend] = useState(true);
  const watchId = useRef(null);
  const mapRef = useRef(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getStatus = (openingHours) => {
    if (!openingHours) return 'Status unknown';
    const now = new Date();
    const time = now.getHours() * 100 + now.getMinutes();
    try {
      const hoursMatch = openingHours.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
      if (hoursMatch) {
        const openTime = parseInt(hoursMatch[1].replace(':', ''));
        const closeTime = parseInt(hoursMatch[2].replace(':', ''));
        return time >= openTime && time <= closeTime ? 'Open now' : 'Closed now';
      }
      return 'Check timings';
    } catch {
      return 'Status unknown';
    }
  };

  const fetchNearestLocations = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];
        (
          node[amenity=hospital](around:2000,${lat},${lng});
          node[amenity~"police|police_station"](around:2000,${lat},${lng});
          node[amenity=pharmacy](around:2000,${lat},${lng});
        );
        out body;>;out skel qt;`
      );
      const data = await response.json();
      
      const locations = data.elements
        .filter(el => el.tags?.name)
        .map(el => ({
          ...el,
          distance: calculateDistance(lat, lng, el.lat, el.lon),
          status: getStatus(el.tags.opening_hours),
          tags: {
            ...el.tags,
            amenity: el.tags.amenity === 'police_station' ? 'police' : el.tags.amenity
          }
        }));
      
      const sortAndSeparate = (amenity) => {
        const list = locations.filter(l => l.tags.amenity === amenity)
                              .sort((a, b) => a.distance - b.distance);
        return { nearest: list[0] || null, others: list.slice(1) };
      };

      const { nearest: nearestHospital, others: otherHospitals } = sortAndSeparate('hospital');
      const { nearest: nearestPolice, others: otherPolice } = sortAndSeparate('police');
      const { nearest: nearestPharmacy, others: otherPharmacies } = sortAndSeparate('pharmacy');

      setNearestLocations({
        hospital: nearestHospital,
        police: nearestPolice,
        pharmacy: nearestPharmacy
      });
      setOtherLocations({
        hospital: otherHospitals,
        police: otherPolice,
        pharmacy: otherPharmacies
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setNearestLocations({ hospital: null, police: null, pharmacy: null });
      setOtherLocations({ hospital: [], police: [], pharmacy: [] });
      setLoading(false);
    }
  };

  useEffect(() => {
    const handlePositionUpdate = async (pos) => {
      const newPos = [pos.coords.latitude, pos.coords.longitude];
      setPosition(newPos);
      setAccuracy(pos.coords.accuracy);
      await fetchNearestLocations(newPos[0], newPos[1]);
      if (mapRef.current) {
        mapRef.current.flyTo(newPos, 16, { animate: true, duration: 1 });
      }
    };

    if (navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        (error) => {
          console.error('Location error:', error);
          setLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  useEffect(() => {
    async function fetchIPLocation() {
      try {
        const response = await fetch('https://ipapi.co/json');
        const data = await response.json();
        const ipLocation = [parseFloat(data.latitude), parseFloat(data.longitude)];
        if (!position || calculateDistance(position[0], position[1], ipLocation[0], ipLocation[1]) > 500) {
          setPosition(ipLocation);
          await fetchNearestLocations(ipLocation[0], ipLocation[1]);
          if (mapRef.current) {
            mapRef.current.flyTo(ipLocation, 16, { animate: true, duration: 1 });
          }
        }
      } catch (error) {
        console.error('IP Location fetch error:', error);
      }
    }
    fetchIPLocation();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      L.control.scale().addTo(mapRef.current);
    }
  }, [mapRef.current]);

  const handleNavigation = (lat, lng, mode = 'drive') => {
    const travelMode = mode === 'walk' ? 'walking' : 'driving';
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${travelMode}`, '_blank');
  };

  const handleRecenter = () => {
    if (position && mapRef.current) {
      mapRef.current.flyTo(position, 16, { animate: true, duration: 1 });
    }
  };

  const toggleTileLayer = () => {
    setSatelliteView(prev => !prev);
  };

  const toggleLegend = () => {
    setShowLegend(prev => !prev);
  };

  const defaultIcon = createCustomIcon('grey');

  const shouldShowMarker = (type) => {
    if (activeFilter === 'all') return true;
    return activeFilter === type;
  };

  const PopupContent = ({ location, type }) => {
    const iconMap = {
      hospital: <FaHospitalSymbol className="text-blue-500 mr-2 text-xl" />,
      police: <FaShieldAlt className="text-green-500 mr-2 text-xl" />,
      pharmacy: <FaMedkit className="text-orange-500 mr-2 text-xl" />
    };
    
    return (
      <div className="min-w-[240px]">
        <div className="flex items-center mb-3">
          {iconMap[type]}
          <h3 className="font-bold text-lg text-gray-800">{location.tags.name}</h3>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm">
            <FaWalking className="text-gray-500 mr-2" />
            <span className="text-gray-700">
              {Math.round(location.distance)}m away
            </span>
          </div>
          
          {location.status && (
            <div className="flex items-center text-sm">
              <FaClock className="text-gray-500 mr-2" />
              <span className={`font-medium ${
                location.status.includes('Open') ? 'text-green-600' : 'text-red-600'
              }`}>
                {location.status}
              </span>
            </div>
          )}
          
          {location.tags.phone && (
            <div className="flex items-center text-sm">
              <FaInfoCircle className="text-gray-500 mr-2" />
              <a href={`tel:${location.tags.phone}`} className="text-blue-600 hover:underline">
                {location.tags.phone}
              </a>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleNavigation(location.lat, location.lon, 'walk')}
            className="flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-200 transition-colors"
          >
            <FaWalking className="mr-1" /> Walk
          </button>
          <button
            onClick={() => handleNavigation(location.lat, location.lon, 'drive')}
            className="flex items-center justify-center bg-purple-100 text-purple-700 px-3 py-2 rounded-md text-sm hover:bg-purple-200 transition-colors"
          >
            <FaCar className="mr-1" /> Drive
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full w-full">
      <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-2xl relative border-2 border-gray-200 bg-white">
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 z-[1000] flex items-center justify-center flex-col"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-purple-700 font-medium">Finding your location...</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {position ? (
          <MapContainer
            ref={mapRef}
            center={position}
            zoom={16}
            className="h-full w-full"
            scrollWheelZoom={true}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              url={
                satelliteView
                  ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
              attribution={
                satelliteView
                  ? '&copy; <a href="https://www.esri.com/">Esri</a>'
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            />

            <Marker position={position} icon={createCustomIcon('red')}>
              <Popup>
                <div className="text-sm font-semibold">
                  <FaMapMarkerAlt className="inline-block text-red-600 mr-1" />
                  Your Location
                  <br />
                  {accuracy && <span className="text-xs">Accuracy: {Math.round(accuracy)}m</span>}
                </div>
              </Popup>
            </Marker>

            {shouldShowMarker('hospital') && nearestLocations.hospital && (
              <Marker
                position={[nearestLocations.hospital.lat, nearestLocations.hospital.lon]}
                icon={createCustomIcon('blue')}
              >
                <Popup>
                  <PopupContent location={nearestLocations.hospital} type="hospital" />
                </Popup>
              </Marker>
            )}

            {shouldShowMarker('hospital') && otherLocations.hospital.map((loc) => (
              <Marker key={`hospital-${loc.id}`} position={[loc.lat, loc.lon]} icon={defaultIcon}>
                <Popup>
                  <PopupContent location={loc} type="hospital" />
                </Popup>
              </Marker>
            ))}

            {shouldShowMarker('police') && nearestLocations.police && (
              <Marker
                position={[nearestLocations.police.lat, nearestLocations.police.lon]}
                icon={createCustomIcon('green')}
              >
                <Popup>
                  <PopupContent location={nearestLocations.police} type="police" />
                </Popup>
              </Marker>
            )}

            {shouldShowMarker('police') && otherLocations.police.map((loc) => (
              <Marker key={`police-${loc.id}`} position={[loc.lat, loc.lon]} icon={defaultIcon}>
                <Popup>
                  <PopupContent location={loc} type="police" />
                </Popup>
              </Marker>
            ))}

            {shouldShowMarker('pharmacy') && nearestLocations.pharmacy && (
              <Marker
                position={[nearestLocations.pharmacy.lat, nearestLocations.pharmacy.lon]}
                icon={createCustomIcon('orange')}
              >
                <Popup>
                  <PopupContent location={nearestLocations.pharmacy} type="pharmacy" />
                </Popup>
              </Marker>
            )}

            {shouldShowMarker('pharmacy') && otherLocations.pharmacy.map((loc) => (
              <Marker key={`pharmacy-${loc.id}`} position={[loc.lat, loc.lon]} icon={defaultIcon}>
                <Popup>
                  <PopupContent location={loc} type="pharmacy" />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md border border-gray-200">
              <h3 className="text-xl font-bold text-purple-700 mb-2">Location Services Required</h3>
              <p className="text-gray-600 mb-4">
                Please enable location services to view nearby resources. We'll show you hospitals, 
                police stations, and pharmacies in your area.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="absolute top-4 left-4 z-[1000] flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all ${
              activeFilter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Resources
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('hospital')}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all ${
              activeFilter === 'hospital' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Hospitals
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('police')}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all ${
              activeFilter === 'police' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Police
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('pharmacy')}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all ${
              activeFilter === 'pharmacy' 
                ? 'bg-orange-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pharmacies
          </motion.button>
        </div>

        {/* Legend */}
        <AnimatePresence>
          {showLegend && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700">Map Legend</h3>
                <button 
                  onClick={toggleLegend}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-600 mr-2 rounded-full"></div>
                  <span className="text-sm">Your Location</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 mr-2 rounded-full"></div>
                  <span className="text-sm">Nearest Hospital</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600 mr-2 rounded-full"></div>
                  <span className="text-sm">Nearest Police</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-600 mr-2 rounded-full"></div>
                  <span className="text-sm">Nearest Pharmacy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-500 mr-2 rounded-full"></div>
                  <span className="text-sm">Other Locations</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2 z-[1000]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecenter}
            className="flex items-center justify-center bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors"
            title="Recenter Map"
          >
            <FaSyncAlt className="text-purple-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTileLayer}
            className="flex items-center justify-center bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors"
            title="Toggle View"
          >
            <FaSatellite className="text-purple-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLegend}
            className="flex items-center justify-center bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors"
            title="Toggle Legend"
          >
            <FaInfoCircle className="text-purple-600" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}