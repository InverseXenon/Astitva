import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'JobFindings',
    description: 'Know your rights, fight for justice',
    icon: '⚖',
    path: '/jobfindings',
  },
  {
    title: 'Health & Wellness',
    description: 'Complete health guidance and support',
    icon: '❤',
    path: '/health-wellness',
  },
  {
    title: 'Education Hub',
    description: 'Scholarships and learning resources',
    icon: '🎓',
    path: '/education-hub',
  },
  {
    title: 'Career Growth',
    description: 'Job opportunities and mentorship',
    icon: '💼',
    path: '/career-growth',
  },
  {
    title: 'Community Support',
    description: 'Connect with fellow warriors',
    icon: '👭',
    path: '/community-support',
  },
  {
    title: 'Financial Freedom',
    description: 'Investment and budgeting guides',
    icon: '💰',
    path: '/financial-freedom',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Empowering Women Through Community & Resources
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Join Astitva to connect with a supportive community, find opportunities, track your health, and access resources designed for women of all backgrounds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Join Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">Our Platform</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-600">Everything You Need in One Place</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Astitva provides a comprehensive set of tools and resources designed specifically for women's empowerment and well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-200 p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-400">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{feature.description}</p>
                  <div className="mt-auto">
                    <Button
                      variant="link"
                      className="text-purple-600 p-0 hover:text-purple-700"
                      onClick={() => handleNavigation(feature.path)}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hear from Our Community</h2>
            <p className=" max-w-2xl mx-auto">
              Real stories from women whose lives have been positively impacted by Astitva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial cards */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        {/* ... same CTA content */}
      </section>

      <ChatbotButton   />
    </main>
  );
}