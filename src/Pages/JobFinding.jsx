import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Users, 
  Calendar,
  ExternalLink,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building,
  Star,
  TrendingUp,
  Heart,
  Bookmark,
  Share2,
  Eye,
  CheckCircle,
  ArrowRight,
  Zap
} from "lucide-react";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());

  // Function to fetch jobs based on page, job type, and search query
  const fetchJobs = async (newPage = page, filter = jobType, query = searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      let apiUrl = `https://api.adzuna.com/v1/api/jobs/in/search/${newPage}?app_id=${import.meta.env.VITE_ADZUNA_API_ID}&app_key=${import.meta.env.VITE_ADZUNA_API_KEY}&results_per_page=12`;

      if (query) apiUrl += `&what=${encodeURIComponent(query)}`;
      if (filter === "full_time") apiUrl += "&full_time=1";
      if (filter === "part_time") apiUrl += "&part_time=1";
      if (filter === "internship") apiUrl += "&contract=1";
      if (filter === "remote") apiUrl += "&where=remote";

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data.results || []);

      const resultsPerPage = 12;
      const totalResults = data.count || 0;
      const calculatedTotalPages = Math.ceil(totalResults / resultsPerPage) || 1;
      setTotalPages(Math.min(calculatedTotalPages, 50));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchJobs(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const applyFilter = (type) => {
    setJobType(type);
    setPage(1);
    fetchJobs(1, type, searchTerm);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs(1, jobType, searchTerm);
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not disclosed";
    return `₹${(salary / 1000).toFixed(0)}K`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const jobTypes = [
    { id: "", label: "All Jobs", icon: Briefcase, color: "bg-gray-500" },
    { id: "full_time", label: "Full-time", icon: Building, color: "bg-blue-500" },
    { id: "part_time", label: "Part-time", icon: Clock, color: "bg-green-500" },
    { id: "internship", label: "Internship", icon: Users, color: "bg-purple-500" },
    { id: "remote", label: "Remote", icon: Zap, color: "bg-indigo-500" }
  ];

  const renderPagination = () => {
    const pageButtons = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    if (page - half < 1) {
      end = Math.min(totalPages, start + maxPagesToShow - 1);
    }
    if (page + half > totalPages) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    if (start > 1) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            page === 1 
              ? "bg-purple-600 text-white shadow-lg" 
              : "bg-white text-purple-600 hover:bg-purple-50 border border-purple-200"
          }`}
        >
          1
        </button>
      );
      if (start > 2) {
        pageButtons.push(<span key="start-ellipsis" className="px-3 py-2 text-gray-400">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            page === i 
              ? "bg-purple-600 text-white shadow-lg" 
              : "bg-white text-purple-600 hover:bg-purple-50 border border-purple-200"
          }`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pageButtons.push(<span key="end-ellipsis" className="px-3 py-2 text-gray-400">...</span>);
      }
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            page === totalPages 
              ? "bg-purple-600 text-white shadow-lg" 
              : "bg-white text-purple-600 hover:bg-purple-50 border border-purple-200"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-medium">AI-Powered Job Matching</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Discover thousands of opportunities tailored for women. Get matched with companies 
              that value diversity and provide growth opportunities.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for jobs, companies, or keywords..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Jobs
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Job Type Filters */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Filter className="w-5 h-5 mr-2 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Filter by Job Type</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {jobTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => applyFilter(type.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  jobType === type.id
                    ? `${type.color} text-white shadow-lg`
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                }`}
              >
                <type.icon className="w-5 h-5 mr-2" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Unable to load jobs</div>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Opportunities
              </h2>
              <p className="text-gray-600">
                Showing {jobs.length} jobs • Page {page} of {totalPages}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {jobs.map((job, index) => (
                <div
                  key={job.id || index}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        <span className="font-medium">{job.company?.display_name || "Company"}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        savedJobs.has(job.id)
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${savedJobs.has(job.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm">{job.location?.display_name || "Location not specified"}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm font-medium">{formatSalary(job.salary_max)}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{formatDate(job.created)}</span>
                    </div>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-700 text-sm line-clamp-3 mb-6">
                    {job.description?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <a
                      href={job.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center justify-center"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {renderPagination()}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobListing;