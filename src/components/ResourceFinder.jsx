// src/components/ResourceFinder.jsx
import React, { useState, useEffect } from 'react';

// Helper to calculate the Haversine distance (in meters)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Map Overpass amenity types to display types
const mapAmenityToType = (amenity) => {
  if (amenity === 'hospital') return 'Hospital';
  if (amenity === 'police') return 'Police Station';
  if (amenity === 'pharmacy') return 'Medical Store';
  return amenity;
};

const ResourceFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: 'All' });
  const [liveData, setLiveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [position, setPosition] = useState(null);

  // Maximum number of list items to display
  const MAX_ITEMS = 3;

  // Fetch live resource data using Overpass API based on current location
  const fetchLiveData = async (lat, lng) => {
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
        .map((el) => {
          const distance = calculateDistance(lat, lng, el.lat, el.lon);
          return {
            id: el.id,
            title: el.tags.name,
            type: mapAmenityToType(el.tags.amenity),
            location: `Lat: ${el.lat}, Lng: ${el.lon}`,
            contact: el.tags.contact || 'Not provided',
            hours: el.tags.opening_hours || 'Not provided',
            description: `Distance: ${Math.round(distance)}m`,
            distance,
          };
        });
      setLiveData(results);
      setFilteredData(results);
    } catch (error) {
      console.error('Error fetching live data:', error);
    }
  };

  // Get user's geolocation and then fetch live data
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newPos = [pos.coords.latitude, pos.coords.longitude];
            setPosition(newPos);
            fetchLiveData(newPos[0], newPos[1]);
          },
          (error) => {
            console.error('Geolocation error:', error);
          },
          { enableHighAccuracy: true }
        );
      }
    };
    getLocation();
  }, []);

  // Update filtered list when search term, filter, or live data changes
  useEffect(() => {
    const filtered = liveData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filters.type === 'All' || item.type === filters.type;
      return matchesSearch && matchesFilter;
    });
    setFilteredData(filtered);
  }, [searchTerm, filters, liveData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({ type: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-purple-600">Resource Finder</h1>
      <p className="text-gray-700 mb-6 text-center">
        Locate essential services near you.
      </p>
      <input
        type="text"
        placeholder="Enter your search..."
        value={searchTerm}
        onChange={handleSearch}
        className="border border-gray-300 rounded-md py-2 px-3 w-full mb-4 text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="flex space-x-4 mb-6 w-full">
        <select
          name="type"
          onChange={handleFilterChange}
          value={filters.type}
          className="border border-gray-300 rounded-md py-2 px-3 text-purple-600 w-full"
        >
          <option value="All">All Types</option>
          <option value="Hospital">Hospital</option>
          <option value="Police Station">Police Station</option>
          <option value="Medical Store">Medical Store</option>
        </select>
      </div>
      <div className="resource-list space-y-4 w-full">
        {filteredData.length > 0 ? (
          filteredData.slice(0, MAX_ITEMS).map((item) => (
            <div
              key={item.id}
              className="border rounded-md p-4 bg-white hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl text-purple-600">{item.title}</h2>
              <p className="text-purple-600">
                <strong>Type:</strong> {item.type}
              </p>
              <p className="text-purple-600">
                <strong>Location:</strong> {item.location}
              </p>
              <p className="text-purple-600">
                <strong>Contact:</strong> {item.contact}
              </p>
              <p className="text-purple-600">
                <strong>Hours:</strong> {item.hours}
              </p>
              <p className="text-purple-600">{item.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default ResourceFinder;
