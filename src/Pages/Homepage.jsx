import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Toaster, toast } from "react-hot-toast";
import FloatingChat from "../components/FloatingChat";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import "swiper/css";
import "swiper/css/autoplay";

const features = [
  {
    title: 'JobFindings',
    description: 'Discover job opportunities tailored to your skills and interests.',
    icon: '🔍',
    path: '/jobfindings',
  },
  {
    title: 'Resource',
    description: 'Access a wealth of medical and general resources to support your personal and professional growth.',
    icon: '🌐',
    path: '/resources',
  },
  {
    title: 'Health',
    description: 'Find information and support for your physical and mental well-being.',
    icon: '🏥',
    path: '/health-wellness',
  },
  {
    title: 'Education-hub',
    description: 'Explore educational resources and courses to enhance your knowledge.',
    icon: '🎓',
    path: '/education',
  },
  {
    title: 'Community Support',
    description: 'Connect with others and find support within your community.',
    icon: '🤝',
    path: '/community-support',
  },
  {
    title: 'Financial Freedom',
    description: 'Learn strategies for managing your finances and achieving financial independence.',
    icon: '💰',
    path: '/financial-freedom',
  },
];

const testimonials = [
  {
    quote: "Astitva helped me find a job after a 5-year career break. The supportive community and resources were exactly what I needed to rebuild my confidence.",
    name: "Priya Sharma",
    role: "Software Developer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote: "The health tracking features have been life-changing. I finally understand my body better and have been able to address health issues I didn't even know I had.",
    name: "Aisha Khan",
    role: "Healthcare Worker",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote: "Through SheFund, I was able to secure funding for my small business. The platform made it easy to share my story and connect with supporters.",
    name: "Meera Patel",
    role: "Entrepreneur",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote: "The community support helped me through a difficult time.",
    name: "Rina Desai",
    role: "Teacher",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote: "Financial education resources helped me become debt-free.",
    name: "Neha Gupta",
    role: "Accountant",
    avatar: "/placeholder.svg?height=100&width=100",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => navigate(path);

  useEffect(() => {
    if (location.state?.showLoginPrompt) {
      toast('Please login to access this feature', {
        duration: 5000,
        position: 'top-center',
        icon: '🔒',
        style: {
          background: '#fff',
          color: '#000',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      });
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

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
                    className="text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all"
                  >
                    Join Now
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  className="text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all"
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
                className="hover:shadow-lg transition-shadow duration-200 p-6 bg-white hover:bg-purple-50 hover:border-purple-200 cursor-pointer"
                onClick={() => handleNavigation(feature.path)}
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

      {/* Testimonials Section with Swiper */}
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

          <div className="relative px-8">
            <Swiper 
              modules={[Autoplay]} 
              autoplay={{ 
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={800}
              spaceBetween={30} 
              slidesPerView={1} 
              breakpoints={{ 
                768: { slidesPerView: 2 }, 
                1024: { slidesPerView: 3 } 
              }}
              loop={true}
              loopAdditionalSlides={2}
              grabCursor={true}
              className="py-4"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="h-full px-2">
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center h-full hover:bg-purple-100 transition-all duration-300">
                      <div className="w-20 h-20 rounded-full mb-6 overflow-hidden border-4 border-purple-100">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-gray-700 italic mb-6 text-lg">"{testimonial.quote}"</p>
                      <div className="mt-auto">
                        <h4 className="font-semibold text-purple-900 text-xl">{testimonial.name}</h4>
                        <p className="text-sm text-purple-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <Toaster position="top-center" />
      <FloatingChat />
    </main>
  );
}