import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Shield, 
  Heart, 
  Sparkles, 
  Play,
  Search,
  Globe,
  Activity,
  GraduationCap,
  Handshake,
  DollarSign,
  Briefcase,
  MapPin,
  Stethoscope,
  BookOpen,
  UserPlus,
  TrendingUp
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Toaster } from "react-hot-toast";
import FloatingChat from "../components/FloatingChat";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
// Import women image from public directory
const womenImage = "/women.jpg"

const features = [
  {
    title: 'Job Opportunities',
    description: 'Discover career opportunities with AI-powered matching and access to exclusive job listings tailored for women.',
    icon: Search,
    path: '/jobfindings',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconBg: 'bg-blue-500'
  },
  {
    title: 'Resource Hub',
    description: 'Access comprehensive medical resources, legal aid, and support materials to guide your journey.',
    icon: Globe,
    path: '/resources',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconBg: 'bg-green-500'
  },
  {
    title: 'Health & Wellness',
    description: 'Track your physical and mental well-being with personalized insights and expert guidance.',
    icon: Activity,
    path: '/health-wellness',
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    iconBg: 'bg-pink-500'
  },
  {
    title: 'Education Hub',
    description: 'Enhance your skills with curated courses, workshops, and educational resources.',
    icon: GraduationCap,
    path: '/education',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconBg: 'bg-purple-500'
  },
  {
    title: 'Community Support',
    description: 'Connect with like-minded women in a safe, supportive environment with mentorship opportunities.',
    icon: Handshake,
    path: '/community',
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    iconBg: 'bg-indigo-500'
  },
  {
    title: 'Financial Freedom',
    description: 'Learn financial literacy, access funding opportunities, and build economic independence.',
    icon: TrendingUp,
    path: '/dashboard',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    iconBg: 'bg-yellow-500'
  },
];

const stats = [
  { label: "Women Empowered", value: "5,000+", icon: Users },
  { label: "Jobs Matched", value: "1,200+", icon: CheckCircle },
  { label: "Success Stories", value: "2,800+", icon: Star },
  { label: "Communities", value: "150+", icon: Heart },
];

const testimonials = [
  {
    quote: "Astitva helped me find my dream job after a 5-year career break. The community support and AI-powered job matching made all the difference in rebuilding my confidence and career.",
    name: "Priya Sharma",
    role: "Software Developer at TechCorp",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    company: "TechCorp"
  },
  {
    quote: "The health tracking features have been transformative. I finally understand my body better and have been able to address health concerns I didn't even know existed.",
    name: "Aisha Khan",
    role: "Healthcare Professional",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    company: "City Hospital"
  },
  {
    quote: "Through the platform, I secured funding for my startup. The financial literacy resources and investor connections opened doors I never thought possible.",
    name: "Meera Patel",
    role: "CEO & Founder",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    company: "GreenTech Solutions"
  },
  {
    quote: "The community support helped me navigate the most challenging period of my life. I found mentors, friends, and opportunities I never imagined.",
    name: "Rina Desai",
    role: "Educator & Advocate",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    company: "Future Academy"
  },
  {
    quote: "The financial education resources helped me become completely debt-free and start investing. My financial confidence has skyrocketed.",
    name: "Neha Gupta",
    role: "Financial Analyst",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    company: "InvestSmart"
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [_activeFeature, setActiveFeature] = useState(0);

  const handleNavigation = (path) => navigate(path);

  // Remove duplicate login prompts - handled by authentication system

  // Auto-rotate active feature
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden -mt-20 pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="container-responsive relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen py-20">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left fade-in">
            <div className="mb-6">
              <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2" />
                Empowering 5,000+ Women Worldwide
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">Empower</span>
              <span className="block bg-gradient-to-r from-purple-100 to-indigo-100 bg-clip-text text-transparent">Elevate</span>
              <span className="block bg-gradient-to-r from-indigo-100 to-pink-100 bg-clip-text text-transparent">Evolve</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl">
              Join Astitva's thriving community of women achieving financial independence, 
              career growth, and personal wellness through AI-powered resources and peer support.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-purple-50 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-purple-50 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignedIn>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-2 border-white/50 hover:border-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="lg:w-1/2 mt-16 lg:mt-0 flex justify-center items-center slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl blur-2xl opacity-30 transform rotate-6"></div>
              <img 
                src={womenImage} 
                alt="Empowered Woman" 
                className="relative w-full max-w-lg h-auto object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-800">2,500+ Active Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Success Partners Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 overflow-hidden">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Organizations
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Partnering with top companies and institutions to create opportunities for women worldwide
            </p>
          </div>
          
          {/* Enhanced Automated Carousel */}
          <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-2xl py-8 shadow-sm">
            <div className="flex animate-scroll hover:pause-animation" style={{ width: '200%' }}>
              <div className="flex items-center space-x-20 min-w-max pr-20">
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">TechCorp</div>
                  <div className="text-xs text-gray-400 mt-1">Technology Solutions</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">GreenTech</div>
                  <div className="text-xs text-gray-400 mt-1">Sustainable Innovation</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">InvestSmart</div>
                  <div className="text-xs text-gray-400 mt-1">Financial Services</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">City Hospital</div>
                  <div className="text-xs text-gray-400 mt-1">Healthcare Network</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">Future Academy</div>
                  <div className="text-xs text-gray-400 mt-1">Education Platform</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">Global Health</div>
                  <div className="text-xs text-gray-400 mt-1">Wellness Initiative</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">HealthTech Pro</div>
                  <div className="text-xs text-gray-400 mt-1">Medical Technology</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">EduCorp</div>
                  <div className="text-xs text-gray-400 mt-1">Learning Solutions</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">WomenFirst</div>
                  <div className="text-xs text-gray-400 mt-1">Empowerment Hub</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">CareerBoost</div>
                  <div className="text-xs text-gray-400 mt-1">Professional Growth</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">FinanceWise</div>
                  <div className="text-xs text-gray-400 mt-1">Financial Planning</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">MentorNet</div>
                  <div className="text-xs text-gray-400 mt-1">Mentorship Platform</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">SkillForge</div>
                  <div className="text-xs text-gray-400 mt-1">Skill Development</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">WellnessHub</div>
                  <div className="text-xs text-gray-400 mt-1">Mental Health Support</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">LeadershipLab</div>
                  <div className="text-xs text-gray-400 mt-1">Leadership Training</div>
                </div>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex items-center space-x-20 min-w-max">
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">TechCorp</div>
                  <div className="text-xs text-gray-400 mt-1">Technology Solutions</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">GreenTech</div>
                  <div className="text-xs text-gray-400 mt-1">Sustainable Innovation</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">InvestSmart</div>
                  <div className="text-xs text-gray-400 mt-1">Financial Services</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">City Hospital</div>
                  <div className="text-xs text-gray-400 mt-1">Healthcare Network</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">Future Academy</div>
                  <div className="text-xs text-gray-400 mt-1">Education Platform</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">Global Health</div>
                  <div className="text-xs text-gray-400 mt-1">Wellness Initiative</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">HealthTech Pro</div>
                  <div className="text-xs text-gray-400 mt-1">Medical Technology</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">EduCorp</div>
                  <div className="text-xs text-gray-400 mt-1">Learning Solutions</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">WomenFirst</div>
                  <div className="text-xs text-gray-400 mt-1">Empowerment Hub</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">CareerBoost</div>
                  <div className="text-xs text-gray-400 mt-1">Professional Growth</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">FinanceWise</div>
                  <div className="text-xs text-gray-400 mt-1">Financial Planning</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">MentorNet</div>
                  <div className="text-xs text-gray-400 mt-1">Mentorship Platform</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">SkillForge</div>
                  <div className="text-xs text-gray-400 mt-1">Skill Development</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">WellnessHub</div>
                  <div className="text-xs text-gray-400 mt-1">Mental Health Support</div>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-2xl font-bold text-gray-600 group-hover:text-purple-600 transition-colors px-6">LeadershipLab</div>
                  <div className="text-xs text-gray-400 mt-1">Leadership Training</div>
                </div>
              </div>
            </div>
            
            {/* Gradient Overlays for Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-indigo-50 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-purple-50 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`text-center slide-up`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-responsive">
          <div className="text-center mb-20 slide-up">
            <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-100 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Comprehensive Platform
            </Badge>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Everything You Need to Thrive
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From career advancement to personal wellness, Astitva provides integrated tools 
              and resources designed specifically for women's success in every aspect of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`card-modern p-8 cursor-pointer transition-all duration-300 ${feature.color} hover:scale-105 slide-up`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => handleNavigation(feature.path)}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="flex flex-col h-full">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 mb-6 flex-1 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-auto">
                    <Button
                      variant="link"
                      className="text-gray-800 p-0 hover:text-purple-600 group font-semibold"
                    >
                      Explore Feature
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Feature Highlight */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white slide-up">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h3>
            <p className="text-xl mb-8 opacity-90">Join thousands of women who've already started their journey to empowerment.</p>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/dashboard')}
              >
                Continue Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="container-responsive">
          <div className="text-center mb-20 slide-up">
            <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-100 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Voices of Transformation
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Real stories from women who've transformed their lives through our platform. 
              Your success story could be next.
            </p>
          </div>

          <div className="relative">
            <Swiper 
              modules={[Autoplay, Pagination]} 
              autoplay={{ 
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet bg-purple-300',
                bulletActiveClass: 'swiper-pagination-bullet-active bg-purple-600',
              }}
              speed={1000}
              spaceBetween={30} 
              slidesPerView={1} 
              breakpoints={{ 
                768: { slidesPerView: 2 }, 
                1024: { slidesPerView: 3 } 
              }}
              loop={true}
              grabCursor={true}
              className="py-8 px-4"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="h-full">
                    <div className="card-modern p-8 text-center h-full flex flex-col hover:shadow-2xl transition-all duration-300">
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="w-20 h-20 rounded-full mx-auto mb-6 overflow-hidden border-4 border-purple-200 shadow-lg">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <blockquote className="text-gray-700 italic mb-8 text-lg leading-relaxed flex-1">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="mt-auto">
                        <h4 className="font-bold text-xl text-gray-900 mb-1">{testimonial.name}</h4>
                        <p className="text-purple-600 font-medium mb-1">{testimonial.role}</p>
                        <p className="text-sm text-gray-500">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Impact & Achievements Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Creating Real Impact
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform has transformed lives across the globe, creating opportunities and building stronger communities for women everywhere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
                             <div className="text-4xl font-bold mb-2">78%</div>
               <div className="text-gray-300">Job Success Rate</div>
             </div>
             
             <div className="text-center">
               <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                 <TrendingUp className="w-10 h-10 text-white" />
               </div>
               <div className="text-4xl font-bold mb-2">120%</div>
               <div className="text-gray-300">Income Growth</div>
             </div>
             
             <div className="text-center">
               <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                 <BookOpen className="w-10 h-10 text-white" />
               </div>
               <div className="text-4xl font-bold mb-2">15K+</div>
               <div className="text-gray-300">Course Completions</div>
             </div>
             
             <div className="text-center">
               <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                 <UserPlus className="w-10 h-10 text-white" />
               </div>
               <div className="text-4xl font-bold mb-2">8K+</div>
               <div className="text-gray-300">Community Members</div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-4">
                <MapPin className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold">Global Reach</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Active communities in 50+ countries, connecting women across cultures and continents.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-4">
                <Stethoscope className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-xl font-semibold">Health Impact</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Over 75% improvement in health awareness and preventive care adoption.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-xl font-semibold">Safety First</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                End-to-end encryption and privacy protection with 24/7 safety monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="container-responsive text-center">
          <div className="max-w-4xl mx-auto slide-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Your Journey to Empowerment Starts Today
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              Join a community that believes in your potential and provides the tools to unlock it. 
              No barriers, no limits—just endless possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-purple-50 shadow-2xl px-10 py-5 text-xl font-bold transform hover:scale-105 transition-all duration-300"
                  >
                    Join Astitva Free
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-purple-50 shadow-2xl px-10 py-5 text-xl font-bold transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/dashboard')}
                >
                  Continue Your Journey
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </SignedIn>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-2 border-white/50 hover:border-white hover:bg-white/10 backdrop-blur-sm px-10 py-5 text-xl font-bold transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-400" />
                <span className="font-semibold">Always Free to Join</span>
              </div>
              <div>
                <Shield className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <span className="font-semibold">Secure & Private</span>
              </div>
              <div>
                <Heart className="w-8 h-8 mx-auto mb-3 text-pink-400" />
                <span className="font-semibold">Supportive Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Toaster position="top-center" />
      <FloatingChat />
    </main>
  );
}