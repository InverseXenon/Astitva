// src/pages/Education.jsx
import React, { useState } from "react";
import { Button } from "../components/Button";
import FloatingChat from "../components/FloatingChat";
import {
  Search,
  Code,
  Book,
  Utensils,
  Leaf,
  Home,
  Scissors,
  Droplet,
  Shirt,
  Wheat,
  Smartphone,
  Database,
  Briefcase,
  Globe,
  Palette,
} from "lucide-react";

const coursesData = [
  {
    id: 1,
    title: "Harvard CS50: Computer Science",
    description: "Harvard's famous introduction to computer science",
    category: "Technology",
    provider: "edX",
    url: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
    level: "Beginner",
    duration: "12 weeks",
    icon: <Code className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 2,
    title: "Google Digital Marketing",
    description: "Fundamentals of digital marketing by Google",
    category: "Technology",
    provider: "Google",
    url: "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",
    level: "Beginner",
    duration: "40 hours",
    icon: <Smartphone className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 3,
    title: "Python for Beginners",
    description: "Learn Python programming fundamentals",
    category: "Technology",
    provider: "Microsoft",
    url: "https://learn.microsoft.com/en-us/training/modules/intro-to-python/",
    level: "Beginner",
    duration: "4 weeks",
    icon: <Code className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 4,
    title: "Traditional Indian Cooking",
    description: "Learn authentic regional recipes from professional chefs",
    category: "Rural Skills",
    provider: "Ministry of Tourism",
    url: "https://www.incredibleindia.org/content/incredible-india-v2/en/events/indian-cooking-class.html",
    level: "Beginner",
    duration: "Self-paced",
    icon: <Utensils className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 5,
    title: "Organic Farming Training",
    description: "Sustainable agriculture techniques by KVK",
    category: "Agriculture",
    provider: "KVK (Govt. of India)",
    url: "https://kvk.icar.gov.in/training.aspx",
    level: "Beginner",
    duration: "1-2 weeks",
    icon: <Leaf className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 6,
    title: "Food Preservation Methods",
    description: "Traditional pickling, drying and canning techniques",
    category: "Rural Skills",
    provider: "NIFTEM",
    url: "https://niftem.ac.in/skill-development-programs/",
    level: "Beginner",
    duration: "3 days",
    icon: <Home className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 7,
    title: "Handloom Weaving Course",
    description: "Traditional textile weaving techniques",
    category: "Handicrafts",
    provider: "Ministry of Textiles",
    url: "https://handlooms.nic.in/Training.aspx",
    level: "Beginner",
    duration: "3 months",
    icon: <Scissors className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 8,
    title: "Natural Dye Preparation",
    description: "Create dyes from plants and flowers",
    category: "Handicrafts",
    provider: "Crafts Council of India",
    url: "https://www.craftscouncilindia.org/workshops",
    level: "Intermediate",
    duration: "2 weeks",
    icon: <Droplet className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 9,
    title: "Basic Tailoring Skills",
    description: "Sewing and garment making fundamentals",
    category: "Rural Skills",
    provider: "NSDC",
    url: "https://www.skillindia.gov.in/training",
    level: "Beginner",
    duration: "3 months",
    icon: <Shirt className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 10,
    title: "Food Processing Training",
    description: "Small-scale food processing for rural entrepreneurs",
    category: "Agriculture",
    provider: "FICSI",
    url: "https://ficsi.in/skill-development-programmes.html",
    level: "Beginner",
    duration: "1 month",
    icon: <Wheat className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 11,
    title: "Bee Keeping Training",
    description: "Apiary management and honey production",
    category: "Agriculture",
    provider: "KVIC",
    url: "https://www.kvic.org.in/training.html",
    level: "Beginner",
    duration: "1 week",
    icon: <Leaf className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 12,
    title: "Pottery Making Course",
    description: "Traditional clay pottery techniques",
    category: "Handicrafts",
    provider: "Khadi Village Industries",
    url: "https://www.kviconline.gov.in/pmegpwebsite/PMEGP_TRAINING.aspx",
    level: "Beginner",
    duration: "2 months",
    icon: <Home className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 13,
    title: "Financial Literacy Program",
    description: "Basic banking and money management",
    category: "Life Skills",
    provider: "RBI",
    url: "https://www.rbi.org.in/scripts/FS_FinancialLiteracy.aspx",
    level: "Beginner",
    duration: "Self-paced",
    icon: <Book className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 14,
    title: "Data Analysis Fundamentals",
    description: "Learn Excel and basic data visualization",
    category: "Technology",
    provider: "Kaggle",
    url: "https://www.kaggle.com/learn/intro-to-data-analysis",
    level: "Beginner",
    duration: "5 hours",
    icon: <Database className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 15,
    title: "Resume Writing Workshop",
    description: "Create professional resumes that stand out",
    category: "Career",
    provider: "Naukri Learning",
    url: "https://learning.naukri.com/free-courses/resume-writing",
    level: "Beginner",
    duration: "2 hours",
    icon: <Briefcase className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 16,
    title: "Spoken English Course",
    description: "Improve English communication skills",
    category: "Language",
    provider: "British Council",
    url: "https://www.britishcouncil.in/english/courses-adults/online-courses",
    level: "Beginner",
    duration: "4 weeks",
    icon: <Globe className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 17,
    title: "Graphic Design Basics",
    description: "Introduction to Canva and design principles",
    category: "Creative",
    provider: "Canva Design School",
    url: "https://www.canva.com/learn/design-school/",
    level: "Beginner",
    duration: "3 hours",
    icon: <Palette className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 18,
    title: "First Aid Training",
    description: "Basic medical emergency response",
    category: "Health",
    provider: "Indian Red Cross",
    url: "https://indianredcross.org/ircs/trainingprogrammes",
    level: "Beginner",
    duration: "2 days",
    icon: <Book className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 19,
    title: "Photography Fundamentals",
    description: "Learn composition and camera techniques",
    category: "Creative",
    provider: "Google Photography",
    url: "https://photography.withgoogle.com/",
    level: "Beginner",
    duration: "Self-paced",
    icon: <Palette className="w-5 h-5 text-purple-500" />,
  },
  {
    id: 20,
    title: "Entrepreneurship Basics",
    description: "Starting and managing small businesses",
    category: "Business",
    provider: "MSME",
    url: "https://msme.gov.in/training-schemes",
    level: "Beginner",
    duration: "4 weeks",
    icon: <Briefcase className="w-5 h-5 text-purple-500" />,
  },
];

const Education = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", icon: null },
    { name: "Technology", icon: <Code className="w-4 h-4" /> },
    { name: "Rural Skills", icon: <Utensils className="w-4 h-4" /> },
    { name: "Agriculture", icon: <Leaf className="w-4 h-4" /> },
    { name: "Handicrafts", icon: <Scissors className="w-4 h-4" /> },
    { name: "Career", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Language", icon: <Globe className="w-4 h-4" /> },
    { name: "Creative", icon: <Palette className="w-4 h-4" /> },
  ];

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex min-h-screen flex-col pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Skill Development Hub
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Free courses in technology, agriculture, handicrafts and more
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses (e.g. 'farming', 'programming')..."
                className="block w-full pl-10 pr-3 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-700 placeholder-purple-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(({ name, icon }) => (
                <button
                  key={name}
                  onClick={() => setSelectedCategory(name)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === name
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  {icon && <span className="mr-2">{icon}</span>}
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                No courses found
              </h3>
              <p className="text-purple-600 mb-6">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "No courses in this category"}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Show All Courses
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-purple-800">
                  {selectedCategory === "All"
                    ? "All Courses"
                    : selectedCategory}
                  <span className="text-purple-500 ml-2">
                    ({filteredCourses.length})
                  </span>
                </h2>
                {searchTerm && (
                  <p className="text-purple-700 font-medium">
                    Showing results for: "{searchTerm}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all h-full flex flex-col border border-purple-100"
                  >
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-flex items-center bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                          {course.icon && (
                            <span className="mr-1">{course.icon}</span>
                          )}
                          {course.category}
                        </span>
                        <span className="text-sm text-purple-500">
                          {course.duration}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-purple-800 mb-3">
                        {course.title}
                      </h3>
                      <p className="text-purple-600 mb-4">
                        {course.description}
                      </p>
                      <div className="mt-auto">
                        <div className="text-sm text-purple-500 mb-3">
                          <span className="font-medium">By:</span>{" "}
                          {course.provider}
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                      >
                        Enroll Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <FloatingChat />
    </main>
  );
};

export default Education;