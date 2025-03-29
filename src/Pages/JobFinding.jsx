import { useState, useEffect } from "react";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState(""); // full_time, part_time, internship, remote

  const fetchJobs = async (reset = false, newPage = page, filter = jobType, query = searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      let apiUrl = `https://api.adzuna.com/v1/api/jobs/in/search/${newPage}?app_id=${import.meta.env.VITE_ADZUNA_API_ID}&app_key=${import.meta.env.VITE_ADZUNA_API_KEY}&results_per_page=10`;

      if (query) apiUrl += `&what=${query}`; // Search by keyword
      if (filter === "full_time") apiUrl += "&full_time=1";
      if (filter === "part_time") apiUrl += "&part_time=1";
      if (filter === "internship") apiUrl += "&contract=1";
      if (filter === "remote") apiUrl += "&where=remote"; // ✅ Fixed Remote Jobs Issue

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(reset ? data.results : [...jobs, ...data.results]); // Append new jobs if not reset
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(true, 1);
  }, []);

  const refreshJobs = () => {
    setPage(1);
    setJobs([]);
    fetchJobs(true, 1);
  };

  const loadMoreJobs = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(false, nextPage);
  };

  const applyFilter = (type) => {
    setJobType(type);
    setPage(1);
    setJobs([]); // Reset job list before applying filter
    fetchJobs(true, 1, type, searchTerm);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setJobs([]);
    fetchJobs(true, 1, jobType, searchTerm);
  };

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">🇮🇳 India Job Listings</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for jobs..."
          className="w-1/3 p-3 border border-purple-400 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-3 rounded-r-lg hover:bg-purple-500 transition"
        >
          🔍 Search
        </button>
      </form>

      {/* Job Type Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => applyFilter("full_time")}
          className={`px-4 py-2 rounded-lg shadow-md ${
            jobType === "full_time" ? "bg-purple-700 text-white" : "bg-purple-300 text-purple-800"
          } hover:bg-purple-500 transition`}
        >
          🏢 Full-time
        </button>
        <button
          onClick={() => applyFilter("part_time")}
          className={`px-4 py-2 rounded-lg shadow-md ${
            jobType === "part_time" ? "bg-purple-700 text-white" : "bg-purple-300 text-purple-800"
          } hover:bg-purple-500 transition`}
        >
          ⏳ Part-time
        </button>
        <button
          onClick={() => applyFilter("internship")}
          className={`px-4 py-2 rounded-lg shadow-md ${
            jobType === "internship" ? "bg-purple-700 text-white" : "bg-purple-300 text-purple-800"
          } hover:bg-purple-500 transition`}
        >
          🎓 Internship
        </button>
        <button
          onClick={() => applyFilter("remote")}
          className={`px-4 py-2 rounded-lg shadow-md ${
            jobType === "remote" ? "bg-purple-700 text-white" : "bg-purple-300 text-purple-800"
          } hover:bg-purple-500 transition`}
        >
          🌍 Remote
        </button>
      </div>

      {/* Refresh & Load More Buttons */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={refreshJobs}
          className="bg-purple-700 text-white px-5 py-2 font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "🔄 Refresh Jobs"}
        </button>

        <button
          onClick={loadMoreJobs}
          className="bg-purple-500 text-white px-5 py-2 font-semibold rounded-lg shadow-md hover:bg-purple-400 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "📥 Load More Jobs"}
        </button>
      </div>

      {loading && <p className="text-center text-purple-700">⏳ Fetching jobs...</p>}
      {error && <p className="text-center text-red-500">❌ {error}</p>}

      {/* Job Listings */}
      <ul className="max-w-5xl mx-auto space-y-6">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <li
              key={job.id || index}
              className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-purple-600 transition-all"
            >
              <h3 className="text-2xl font-bold text-purple-700">{job.title || "Untitled Job"}</h3>
              <p className="text-purple-600 font-medium">
                {job.company?.display_name || "Unknown Company"}
              </p>
              <p className="text-purple-500">
                {job.location?.display_name || "Location Not Available"}
              </p>
              <a
                href={job.redirect_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 font-bold hover:underline mt-2 block"
              >
                🔗 View Job
              </a>
            </li>
          ))
        ) : (
          !loading && <p className="text-center text-gray-500">⚠️ No jobs found.</p>
        )}
      </ul>
    </div>
  );
};

export default JobListing;