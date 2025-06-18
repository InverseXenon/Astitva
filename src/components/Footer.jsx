import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Shield,
  Award,
  Users,
  Globe,
  ArrowRight,
  ExternalLink,
  Star,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
  BookOpen
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const navigationLinks = [
    {
      title: "Platform",
      links: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Job Opportunities", href: "/jobfindings" },
        { name: "Health & Wellness", href: "/health-wellness" },
        { name: "Community", href: "/community" },
        { name: "Education Hub", href: "/education" },
        { name: "Resource Finder", href: "/resources" }
      ]
    },
    {
      title: "Empowerment",
      links: [
        { name: "Career Development", href: "/career-development" },
        { name: "Financial Literacy", href: "/financial-literacy" },
        { name: "Leadership Training", href: "/leadership" },
        { name: "Skill Building", href: "/skills" },
        { name: "Mentorship Program", href: "/mentorship" },
        { name: "Success Stories", href: "/success-stories" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Safety Guidelines", href: "/safety" },
        { name: "Mental Health Resources", href: "/mental-health" },
        { name: "Legal Support", href: "/legal" },
        { name: "Crisis Support", href: "/crisis" },
        { name: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Astitva", href: "/about" },
        { name: "Our Mission", href: "/mission" },
        { name: "Impact Report", href: "/impact" },
        { name: "Partnerships", href: "/partnerships" },
        { name: "Careers", href: "/careers" },
        { name: "Press Kit", href: "/press" }
      ]
    }
  ];

  const achievements = [
    { icon: Users, label: "5,000+", description: "Women Empowered" },
    { icon: CheckCircle, label: "78%", description: "Success Rate" },
    { icon: Globe, label: "15+", description: "Countries" },
    { icon: Award, label: "50+", description: "Awards Won" }
  ];

  const trustIndicators = [
    { icon: Shield, text: "Data Protected", detail: "ISO 27001 Certified" },
    { icon: Award, text: "Award Winning", detail: "Best Women's Platform 2024" },
    { icon: Star, text: "Highly Rated", detail: "4.9/5 User Rating" },
    { icon: CheckCircle, text: "Verified Safe", detail: "Trusted by 5,000+ Women" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <Sparkles className="w-5 h-5 mr-2 text-purple-300" />
                <span className="text-purple-200 font-medium">Join Our Empowerment Community</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Transform Your Life Today
              </h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Get exclusive access to career opportunities, wellness resources, financial guidance, 
                and connect with a supportive community of empowered women worldwide.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between bg-white/5 backdrop-blur-sm rounded-2xl p-8">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email for weekly empowerment insights"
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center">
                    Join Community
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  📧 Weekly insights • 🎯 Career tips • 💪 Wellness guidance • 🚀 Success stories
                </p>
              </div>
              
              <div className="lg:w-1/2 lg:pl-12">
                <div className="grid grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl mx-auto mb-3">
                        <achievement.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{achievement.label}</div>
                      <div className="text-sm text-gray-300">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Astitva
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                Empowering women through AI-powered career matching, comprehensive health tracking, 
                financial literacy programs, and a supportive global community. Your journey to 
                independence and success starts here.
              </p>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                    <indicator.icon className="w-5 h-5 text-purple-300 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white text-sm">{indicator.text}</div>
                      <div className="text-xs text-gray-400">{indicator.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 group"
                  >
                    <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            {navigationLinks.map((section, index) => (
              <div key={index} className="lg:col-span-1">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                  {section.title}
                  <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent ml-3"></div>
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group text-sm"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                        <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Legal Section */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Get in Touch</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail className="w-4 h-4 text-purple-300" />
                    <span className="text-sm">support@astitva.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Phone className="w-4 h-4 text-purple-300" />
                    <span className="text-sm">+91 94053 02470</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MapPin className="w-4 h-4 text-purple-300" />
                    <span className="text-sm">Mumbai, India</span>
                  </div>
                </div>
              </div>

              {/* SDG Goals */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">UN SDG Impact</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Contributing to Sustainable Development Goals:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Goal 3: Good Health",
                    "Goal 4: Quality Education", 
                    "Goal 5: Gender Equality",
                    "Goal 8: Decent Work"
                  ].map((goal, index) => (
                    <span key={index} className="bg-white/10 text-xs px-3 py-1 rounded-full text-gray-200">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Our Mission */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Our Mission</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300 text-sm">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>Empowering Women Globally</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 text-sm">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>AI-Powered Career Growth</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 text-sm">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Community & Support Network</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-white/10">
              <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8 mb-4 lg:mb-0">
                <p className="text-gray-400 text-sm">
                  © {currentYear} Astitva. All rights reserved.
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                  <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
                  <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Made with love for women's empowerment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;