import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import FloatingChat from "../components/FloatingChat";
// import Avatar from "../components/Avatar";
import {Button} from "../components/Button";
import {Card} from "../components/Card";
import {TestimonialCard} from "../components/TestimonialCard";
import {Badge} from "../components/Badge";

const features = [
  {
    title: 'JobFindings',
    description: 'Discover job opportunities tailored to your skills and interests.',
    icon: '🔍', // Magnifying glass for job searching
    path: '/jobfindings',
  },
  {
    title: 'Resource',
    description: 'Access a wealth of medical and general resources to support your personal and professional growth.',
    icon: '🌐', // Globe for general resources
    path: '/resources',
  },
  {
    title: 'Health',
    description: 'Find information and support for your physical and mental well-being.',
    icon: '🏥', // Hospital for health services
    path: '/health-wellness',
  },
  {
    title: 'Education-hub',
    description: 'Explore educational resources and courses to enhance your knowledge.',
    icon: '🎓', // Graduation cap for education
    path: '/education',
  },
  {
    title: 'Community Support',
    description: 'Connect with others and find support within your community.',
    icon: '🤝', // Handshake for community support
    path: '/community-support',
  },
  {
    title: 'Financial Freedom',
    description: 'Learn strategies for managing your finances and achieving financial independence.',
    icon: '💰', // Money bag for financial success
    path: '/financial-freedom',
  },
];
const testimonials = [
  {
    quote:
      "Astitva helped me find a job after a 5-year career break. The supportive community and resources were exactly what I needed to rebuild my confidence.",
    name: "Priya Sharma",
    role: "Software Developer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "The health tracking features have been life-changing. I finally understand my body better and have been able to address health issues I didn't even know I had.",
    name: "Aisha Khan",
    role: "Healthcare Worker",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "Through SheFund, I was able to secure funding for my small business. The platform made it easy to share my story and connect with supporters.",
    name: "Meera Patel",
    role: "Entrepreneur",
    avatar: "/placeholder.svg?height=100&width=100",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => navigate(path);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-800 py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Empowering Women Through Community & Resources
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Join Astitva to connect with a supportive community, find
              opportunities, track your health, and access resources designed
              for women of all backgrounds.
            </p>
            <div className="flex flex-wrap gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className=" text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all"
                  >
                    Join Now
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  className=" text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </SignedIn>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-2 border-white/80 hover:border-white hover:bg-white/20 backdrop-blur-sm"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-full opacity-10">
          <div className="w-full h-full bg-[url('/placeholder.svg?height=800&width=800')] bg-no-repeat bg-right-bottom bg-contain"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">
              Our Platform
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-600">
              Everything You Need in One Place
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Astitva provides a comprehensive set of tools and resources
              designed specifically for women's empowerment and well-being.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="hover:shadow-lg transition-shadow duration-200 p-6 bg-white"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-400">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-1">
                    {feature.description}
                  </p>
                  <div className="mt-auto">
                    <Button
                      variant="link"
                      className="text-purple-600 p-0 hover:text-purple-700 group"
                      onClick={() => handleNavigation(feature.path)}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">
        Success Stories
      </Badge>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-900">
        Voices of Empowerment
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto text-lg">
        Discover how women are transforming their lives through our community
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {testimonials.map((testimonial, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
        >
          <div className="flex flex-col h-full">
            {/* Quote Icon */}
            <div className="mb-4 text-purple-600">
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700 mb-6 flex-1 italic">
              "{testimonial.quote}"
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 border-t border-purple-100 pt-4">
              <div className="flex-shrink-0">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-purple-900">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-purple-600">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    
  </div>
</section>

      

      <FloatingChat />
    </main>
  );
}