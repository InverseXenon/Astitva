import { useState, useEffect } from "react";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total pages, capped at 50
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("");

  // Function to fetch jobs based on page, job type, and search query
  const fetchJobs = async (newPage = page, filter = jobType, query = searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      let apiUrl = `https://api.adzuna.com/v1/api/jobs/in/search/${newPage}?app_id=${import.meta.env.VITE_ADZUNA_API_ID}&app_key=${import.meta.env.VITE_ADZUNA_API_KEY}&results_per_page=10`;

      if (query) apiUrl += `&what=${encodeURIComponent(query)}`;
      if (filter === "full_time") apiUrl += "&full_time=1";
      if (filter === "part_time") apiUrl += "&part_time=1";
      if (filter === "internship") apiUrl += "&contract=1";
      if (filter === "remote") apiUrl += "&where=remote";

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data.results || []);

      // Calculate total pages and cap at 50
      const resultsPerPage = 10;
      const totalResults = data.count || 0; // Replace with actual API field if different
      const calculatedTotalPages = Math.ceil(totalResults / resultsPerPage) || 1;
      setTotalPages(Math.min(calculatedTotalPages, 50)); // Cap total pages at 50
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on initial load
  useEffect(() => {
    fetchJobs(1);
  }, []);

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchJobs(newPage);
    }
  };

  // Apply job type filter
  const applyFilter = (type) => {
    setJobType(type);
    setPage(1); // Reset to first page
    fetchJobs(1, type, searchTerm);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    fetchJobs(1, jobType, searchTerm);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pageButtons = [];
    const maxPagesToShow = 5; // Show 5 pages at a time
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    // Adjust start and end to always show 5 pages when possible
    if (page - half < 1) {
      end = Math.min(totalPages, start + maxPagesToShow - 1);
    }
    if (page + half > totalPages) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    // Add first page and ellipsis if necessary
    if (start > 1) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 rounded-lg ${
            page === 1 ? "bg-purple-700 text-white" : "bg-purple-300 text-purple-800"
          } hover:bg-purple-500 transition`}
        >
          1
        </button>
      );
      if (start > 2) {
        pageButtons.push(<span key="start-ellipsis" className="px-3 py-1">...</span>);
      }
    }

    // Add page numbers
    for (let i = start; i <= end; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg ${
            page === i ? "bg-purple-700 text-white" : "bg-purple-300 text-purple-800"
          } hover:bg-purple-500 transition`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if necessary
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pageButtons.push(<span key="end-ellipsis" className="px-3 py-1">...</span>);
      }
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded-lg ${
            page === totalPages ? "bg-purple-700 text-white" : "bg-purple-300 text-purple-800"
          } hover:bg-purple-500 transition`}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
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
          onClick={() => applyFilter("")}
          className={`px-4 py-2 rounded-lg shadow-md ${
            jobType === "" ? "bg-purple-700 text-white" : "bg-purple-300 text-purple-800"
          } hover:bg-purple-500 transition`}
        >
          All Jobs
        </button>
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-400 transition disabled:opacity-50"
        >
          Previous
        </button>
        {renderPagination()}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || loading}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-400 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-purple-700">⏳ Fetching jobs...</p>}
      {error && (
        <div className="text-center mb-6">
          <p className="text-red-500">❌ {error}</p>
          <button
            onClick={() => fetchJobs(page)}
            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
          >
            Retry
          </button>
        </div>
      )}

      {/* Job Listings */}
      <ul className="max-w-5xl mx-auto space-y-6">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <li
              key={job.id || index}
              className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-purple-600 transition-all"
            >
              <a
                href={job.redirect_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold text-purple-700 hover:underline"
              >
                {job.title || "Untitled Job"}
              </a>
              <p className="text-purple-600 font-medium mt-2">
                🏢 {job.company?.display_name || "Unknown Company"}
              </p>
              <p className="text-purple-500">
                📍 {job.location?.display_name || "Location Not Available"}
              </p>
              {job.salary_min && job.salary_max && (
                <p className="text-purple-500">
                  💰 Salary: ₹{job.salary_min} - ₹{job.salary_max}
                </p>
              )}
              {job.description && (
                <p className="text-purple-600 mt-2">
                  {job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>
              )}
              {job.created && (
                <p className="text-purple-400 text-sm mt-2">
                  Posted on: {new Date(job.created).toLocaleDateString()}
                </p>
              )}
              <a
                href={job.redirect_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 font-bold hover:underline mt-4 block"
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