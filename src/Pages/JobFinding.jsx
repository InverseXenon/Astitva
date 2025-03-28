import { useState } from "react";
import { Briefcase, Filter, MapPin, Search } from "lucide-react";

const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: {
        name: "Tech Solutions",
        logo: "/path/to/logo1.png", // Replace with actual logo path
      },
      location: "New York, NY",
      description: "Develop and maintain software applications.",
      skills: ["JavaScript", "React", "Node.js"],
      type: "Full-time",
      salary: "$80,000 - $100,000",
    },
    {
      id: 2,
      title: "Product Manager",
      company: {
        name: "Innovate Inc.",
        logo: "/path/to/logo2.png", // Replace with actual logo path
      },
      location: "Remote",
      description: "Lead product development and strategy.",
      skills: ["Agile", "Communication", "Leadership"],
      type: "Full-time",
      salary: "$90,000 - $120,000",
    },
    {
      id: 3,
      title: "Graphic Designer",
      company: {
        name: "Creative Co.",
        logo: "/path/to/logo3.png", // Replace with actual logo path
      },
      location: "Los Angeles, CA",
      description: "Design graphics for marketing and branding.",
      skills: ["Photoshop", "Illustrator", "Creativity"],
      type: "Part-time",
      salary: "$30,000 - $50,000",
    },
    {
      id: 4,
      title: "Intern Software Developer",
      company: {
        name: "StartUp Inc.",
        logo: "/path/to/logo4.png", // Replace with actual logo path
      },
      location: "Remote",
      description: "Assist in software development tasks.",
      skills: ["Java", "Spring", "SQL"],
      type: "Internship",
      salary: "Unpaid",
    },
    {
      id: 5,
      title: "Data Analyst",
      company: {
        name: "Data Insights",
        logo: "/path/to/logo5.png", // Replace with actual logo path
      },
      location: "Chicago, IL",
      description: "Analyze data to drive business decisions.",
      skills: ["Excel", "SQL", "Python"],
      type: "Full-time",
      salary: "$70,000 - $90,000",
    },
    {
      id: 6,
      title: "Marketing Intern",
      company: {
        name: "Marketing Pros",
        logo: "/path/to/logo6.png", // Replace with actual logo path
      },
      location: "Remote",
      description: "Support marketing campaigns and initiatives.",
      skills: ["Social Media", "Content Creation"],
      type: "Internship",
      salary: "Unpaid",
    },
  ];
  

export default function JobFindings() {
  const [filter, setFilter] = useState("All");
  const filteredJobs = filter === "All" ? jobs : jobs.filter(job => job.type === filter);

  return (
    <main className="container mx-auto px-4 py-8 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-purple-600">Job Marketplace</h1>
          <p className="text-gray-600 max-w-2xl">
            Find employment opportunities, showcase your skills, and connect with women-friendly employers.
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <Briefcase className="mr-2 h-4 w-4" /> Post a Job
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or keyword..."
                className="pl-10 border border-gray-300 rounded-md py-2 px-3 w-full"
              />
            </div>
            <button className="flex items-center border border-gray-300 rounded-md py-2 px-4 bg-purple-100 hover:bg-purple-200">
              <Filter className="mr-2 h-4 w-4 text-purple-600" /> Filter
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {["All", "Full-time", "Part-time", "Internship", "Remote"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === type
                    ? "bg-purple-600 text-white ring-2 ring-purple-300"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="border rounded-md p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 mr-3 bg-gray-100 rounded-full overflow-hidden">
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-purple-600">{job.title}</h2>
                      <p className="text-gray-600">{job.company.name}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      job.type === "Full-time"
                        ? "bg-purple-100 text-purple-800"
                        : job.type === "Part-time"
                        ? "bg-blue-100 text-blue-800"
                        : job.type === "Internship"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {job.type}
                  </span>
                </div>

                <div className="flex items-center text-sm text-purple-600 mt-3 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>

                <p className="text-gray-700 mb-3">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-50 border border-purple-200 rounded-md px-2 py-1 text-sm text-purple-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="font-medium text-purple-600">{job.salary}</p>
                  <div className="flex gap-2">
                    <button className="border border-gray-300 rounded-md py-1 px-3 text-purple-600 hover:bg-gray-50">
                      Save
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1 px-3 rounded">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4 space-y-6">
          <div className="border rounded-md">
            <div className="bg-purple-100 p-4 rounded-t-md">
              <h3 className="font-semibold text-purple-600">Job Search Tips</h3>
            </div>
            <div className="p-4 space-y-2 text-sm text-purple-600">
              <p>• Update your profile to showcase your skills</p>
              <p>• Set up job alerts for new opportunities</p>
              <p>• Research companies before applying</p>
              <p>• Tailor your resume for each application</p>
              <p>• Prepare for interviews with our resources</p>
            </div>
            <div className="p-4 border-t">
              <button className="text-purple-600 hover:text-purple-700 text-sm">
                View Career Resources →
              </button>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="bg-purple-100 p-4 rounded-t-md">
              <h3 className="font-semibold text-purple-600">Popular Job Categories</h3>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {["Technology", "Healthcare", "Education", "Finance", "Marketing", "Design"].map(
                (category) => (
                  <span
                    key={category}
                    className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-sm border border-purple-200 hover:bg-purple-100 cursor-pointer"
                  >
                    {category}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="border rounded-md">
            <div className="bg-purple-100 p-4 rounded-t-md">
              <h3 className="font-semibold text-purple-600">Featured Employers</h3>
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src={`https://via.placeholder.com/50x50?text=Co.${i}`}
                      alt={`Company ${i} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600">Company {i}</p>
                    <p className="text-xs text-gray-500">{10 - i} open positions</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <button className="text-purple-600 hover:text-purple-700 text-sm">
                View All Employers →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}