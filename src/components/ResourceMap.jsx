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
  FaSatellite 
} from 'react-icons/fa';

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
      const locations = data.elements
        .filter(el => el.tags?.name)
        .map(el => ({
          ...el,
          distance: calculateDistance(lat, lng, el.lat, el.lon),
          status: getStatus(el.tags.opening_hours)
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
    } catch (error) {
      console.error('Error fetching locations:', error);
      setNearestLocations({ hospital: null, police: null, pharmacy: null });
      setOtherLocations({ hospital: [], police: [], pharmacy: [] });
    }
  };

  useEffect(() => {
    const handlePositionUpdate = async (pos) => {
      const newPos = [pos.coords.latitude, pos.coords.longitude];
      setPosition(newPos);
      setAccuracy(pos.coords.accuracy);
      await fetchNearestLocations(newPos[0], newPos[1]);
      setLoading(false);
      if (mapRef.current) {
        mapRef.current.flyTo(newPos, 16, { animate: true, duration: 1 });
      }
    };

    if (navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        (error) => {
          console.error('Location error:', error);
          alert('Enable location access for accurate results');
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

  const handleNavigation = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const handleRecenter = () => {
    if (position && mapRef.current) {
      mapRef.current.flyTo(position, 16, { animate: true, duration: 1 });
    }
  };

  const toggleTileLayer = () => {
    setSatelliteView(prev => !prev);
  };

  const defaultIcon = createCustomIcon('grey');

  return (
    <div className="relative">
      <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-[1000] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        )}
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

            {nearestLocations.hospital && (
              <Marker
                position={[nearestLocations.hospital.lat, nearestLocations.hospital.lon]}
                icon={createCustomIcon('blue')}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center mb-2">
                      <FaHospitalSymbol className="text-blue-600 mr-2" />
                      <h3 className="font-bold text-lg">{nearestLocations.hospital.tags.name}</h3>
                    </div>
                    <p className="text-sm mb-1">
                      Distance: {Math.round(nearestLocations.hospital.distance)}m
                    </p>
                    <p className="text-sm mb-1">
                      Status:{' '}
                      <span className={`font-semibold ${
                        nearestLocations.hospital.status.includes('Open') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {nearestLocations.hospital.status}
                      </span>
                    </p>
                    <p className="text-xs">
                      Lat: {nearestLocations.hospital.lat}, Lng: {nearestLocations.hospital.lon}
                    </p>
                    <button
                      onClick={() =>
                        handleNavigation(nearestLocations.hospital.lat, nearestLocations.hospital.lon)
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors w-full mt-2"
                    >
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}

            {otherLocations.hospital.map((loc) => (
              <Marker key={`hospital-${loc.id}`} position={[loc.lat, loc.lon]} icon={defaultIcon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center mb-2">
                      <FaHospitalSymbol className="text-blue-600 mr-2" />
                      <h3 className="font-bold text-lg">{loc.tags.name}</h3>
                    </div>
                    <p className="text-sm mb-1">Distance: {Math.round(loc.distance)}m</p>
                    <p className="text-xs">
                      Lat: {loc.lat}, Lng: {loc.lon}
                    </p>
                    <button
                      onClick={() => handleNavigation(loc.lat, loc.lon)}
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors w-full mt-2"
                    >
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {nearestLocations.police && (
              <Marker
                position={[nearestLocations.police.lat, nearestLocations.police.lon]}
                icon={createCustomIcon('green')}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center mb-2">
                      <FaShieldAlt className="text-green-600 mr-2" />
                      <h3 className="font-bold text-lg">{nearestLocations.police.tags.name}</h3>
                    </div>
                    <p className="text-sm mb-1">
                      Distance: {Math.round(nearestLocations.police.distance)}m
                    </p>
                    <p className="text-xs">
                      Lat: {nearestLocations.police.lat}, Lng: {nearestLocations.police.lon}
                    </p>
                    <button
                      onClick={() =>
                        handleNavigation(nearestLocations.police.lat, nearestLocations.police.lon)
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors w-full mt-2"
                    >
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}

            {otherLocations.police.map((loc) => (
              <Marker key={`police-${loc.id}`} position={[loc.lat, loc.lon]} icon={defaultIcon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center mb-2">
                      <FaShieldAlt className="text-green-600 mr-2" />
                      <h3 className="font-bold text-lg">{loc.tags.name}</h3>
                    </div>
                    <p className="text-sm mb-1">Distance: {Math.round(loc.distance)}m</p>
                    <p className="text-xs">
                      Lat: {loc.lat}, Lng: {loc.lon}
                    </p>
                    <button
                      onClick={() => handleNavigation(loc.lat, loc.lon)}
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors w-full mt-2"
                    >
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {nearestLocations.pharmacy && (
              <Marker
                position={[nearestLocations.pharmacy.lat, nearestLocations.pharmacy.lon]}
                icon={createCustomIcon('orange')}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center mb-2">
                      <FaMedkit className="text-orange-600 mr-2" />
                      <h3 className="font-bold text-lg">{nearestLocations.pharmacy.tags.name}</h3>
                    </div>
                    <p className="text-sm mb-1">
                      Distance: {Math.round(nearestLocations.pharmacy.distance)}m
                    </p>
                    <p className="text-sm mb-1">
                      Status:{' '}
                      <span className={`font-semibold ${
                        nearestLocations.pharmacy.status.includes('Open') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {nearestLocations.pharmacy.status}
                      </span>
                    </p>
                    <p className="text-xs">
                      Lat: {nearestLocations.pharmacy.lat}, Lng: {nearestLocations.pharmacy.lon}
                    </p>
                    <button
                      onClick={() =>
                        handleNavigation(nearestLocations.pharmacy.lat, nearestLocations.pharmacy.lon)
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors w-full mt-2"
                    >
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}

            {otherLocations.pharmacy.map((loc) => (
              <Marker key={`pharmacy-${loc.id}`} position={[loc.lat, loc.lon]} icon={defaultIcon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center mb-2">
                      <FaMedkit className="text-orange-600 mr-2" />
                      <h3 className="font-bold text-lg">{loc.tags.name}</h3>
                    </div>
                    <p className="text-sm mb-1">Distance: {Math.round(loc.distance)}m</p>
                    <p className="text-xs">
                      Lat: {loc.lat}, Lng: {loc.lon}
                    </p>
                    <button
                      onClick={() => handleNavigation(loc.lat, loc.lon)}
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors w-full mt-2"
                    >
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Enabling location services...</p>
          </div>
        )}

        <div className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-md shadow-md text-sm">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-red-600 mr-2 rounded-full"></div>
            Your Location
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#1E90FF' }} className="mr-2 rounded-full"></div>
            Nearest Hospital
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#28a745' }} className="mr-2 rounded-full"></div>
            Nearest Police
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#fd7e14' }} className="mr-2 rounded-full"></div>
            Nearest Medical Store
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 mr-2 rounded-full"></div>
            Other Nearby
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 flex flex-col space-y-2 z-[1000]">
        <button
          onClick={handleRecenter}
          className="flex items-center bg-white p-2 rounded-md shadow-md text-sm hover:bg-gray-100 transition-colors"
        >
          <FaSyncAlt className="mr-1" /> Recenter
        </button>
        <button
          onClick={toggleTileLayer}
          className="flex items-center bg-white p-2 rounded-md shadow-md text-sm hover:bg-gray-100 transition-colors"
        >
          <FaSatellite className="mr-1" /> {satelliteView ? 'Default View' : 'Satellite View'}
        </button>
      </div>
    </div>
  );
}
