import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, BookOpen, Trophy, Target, CheckCircle, Star, Clock, Award, TrendingUp, Briefcase, Shield } from 'lucide-react';
import EnrollmentModal from '../components/EnrollmentModal';
import AiCareerAdvisor from '../components/AiCareerAdvisor';
import ScrollNavigation from '../components/ScrollNavigation';

const CollegeTrainingLandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(2847);

  useEffect(() => {
    // Simulate visitor count updates
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Bulk Training Excellence",
      description: "Specialized programs designed for 100-200 student batches with industry-focused curriculum"
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Placement-Ready Skills",
      description: "Skills specifically chosen by recruiters from top companies for immediate employment"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-500" />,
      title: "Industry Certifications",
      description: "Students receive industry-recognized certificates that boost their resume value"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-orange-500" />,
      title: "Job Placement Support",
      description: "Direct connections with hiring partners and dedicated placement assistance"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-red-500" />,
      title: "Career Growth Focus",
      description: "Training aligned with industry trends and emerging cybersecurity roles"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-500" />,
      title: "Hands-on Learning",
      description: "Real-world labs, live projects, and practical scenarios for better learning retention"
    }
  ];

  const collegeSuccessStories = [
    {
      college: "VIT Chennai",
      students: 180,
      placed: 156,
      avgSalary: "₹4.2 LPA",
      topCompany: "TCS, Wipro, Infosys"
    },
    {
      college: "SRM University",
      students: 200,
      placed: 175,
      avgSalary: "₹3.8 LPA", 
      topCompany: "Cognizant, HCL, Tech Mahindra"
    },
    {
      college: "Anna University",
      students: 150,
      placed: 135,
      avgSalary: "₹4.5 LPA",
      topCompany: "L&T Infotech, Zoho, Freshworks"
    }
  ];

  const curriculumModules = [
    {
      week: "Week 1-2",
      title: "Cybersecurity Fundamentals",
      topics: ["Network Security Basics", "Threat Landscape", "Security Frameworks", "Risk Assessment"]
    },
    {
      week: "Week 3-4", 
      title: "Defensive Security Skills",
      topics: ["SOC Operations", "Incident Response", "Log Analysis", "Security Monitoring"]
    },
    {
      week: "Week 5-6",
      title: "Ethical Hacking Basics", 
      topics: ["Penetration Testing", "Vulnerability Assessment", "Web Application Security", "Network Scanning"]
    },
    {
      week: "Week 7-8",
      title: "Industry Projects & Certification",
      topics: ["Capstone Project", "Industry Case Studies", "Certification Exam", "Placement Preparation"]
    }
  ];

  const pricingTiers = [
    {
      name: "Standard Batch",
      students: "50-99 Students", 
      price: "₹399",
      originalPrice: "₹599",
      features: [
        "8-week comprehensive training",
        "Industry-standard curriculum",
        "Basic certification",
        "Email support",
        "Basic placement assistance"
      ]
    },
    {
      name: "Premium Batch",
      students: "100-149 Students",
      price: "₹299", 
      originalPrice: "₹499",
      popular: true,
      features: [
        "8-week intensive training",
        "Advanced hands-on labs",
        "Premium certification", 
        "Dedicated support manager",
        "Priority placement support",
        "Industry mentor sessions"
      ]
    },
    {
      name: "Elite Batch",
      students: "150+ Students",
      price: "₹199",
      originalPrice: "₹399", 
      features: [
        "10-week comprehensive program",
        "Real-world project assignments",
        "Elite certification with portfolio",
        "24/7 support & mentorship",
        "Guaranteed placement assistance", 
        "Direct recruiter connects",
        "Alumni network access"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm">College Bulk Training Program</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Transform Your Students Into
              <span className="block">Cybersecurity Professionals</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Comprehensive cybersecurity training designed specifically for engineering colleges. 
              Train 100-200 students with industry-focused curriculum and guaranteed placement support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Get Bulk Pricing Quote
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="border border-gray-600 hover:border-blue-500 px-8 py-4 rounded-lg font-semibold transition-colors">
                Download Course Curriculum
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>500+ Colleges Trained</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>15,000+ Students Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>85% Placement Success</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">College Success Stories</h2>
            <p className="text-gray-400 text-lg">Real results from engineering colleges across India</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {collegeSuccessStories.map((story, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">{story.college}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Students Trained:</span>
                    <span className="font-semibold">{story.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Successfully Placed:</span>
                    <span className="font-semibold text-green-400">{story.placed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Salary:</span>
                    <span className="font-semibold text-yellow-400">{story.avgSalary}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <span className="text-gray-400 text-sm">Top Recruiters:</span>
                    <p className="text-sm font-medium mt-1">{story.topCompany}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our College Training Program?</h2>
            <p className="text-gray-400 text-lg">Designed specifically for engineering students and fresh graduates</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">8-Week Industry-Ready Curriculum</h2>
            <p className="text-gray-400 text-lg">Comprehensive training program designed by industry experts</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculumModules.map((module, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-blue-400 font-semibold mb-2">{module.week}</div>
                <h3 className="text-lg font-semibold mb-4">{module.title}</h3>
                <ul className="space-y-2">
                  {module.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400 text-sm">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">College Bulk Pricing</h2>
            <p className="text-gray-400 text-lg">Special rates for engineering colleges - bigger batches, better prices!</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`bg-gray-800 rounded-xl p-6 border ${tier.popular ? 'border-blue-500 relative' : 'border-gray-700'}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <p className="text-gray-400 mb-4">{tier.students}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-400">{tier.price}</span>
                    <span className="text-gray-400">/student</span>
                    <div className="text-sm text-gray-500 line-through">{tier.originalPrice}/student</div>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    tier.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border border-gray-600 hover:border-blue-500 text-gray-300'
                  }`}
                >
                  Get Quote for {tier.students}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Train Your Students?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Join 500+ engineering colleges that have successfully trained over 15,000 students with our proven curriculum.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              Start College Training Program
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="border border-gray-600 hover:border-blue-500 px-8 py-4 rounded-lg font-semibold transition-colors">
              Schedule College Demo
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-400">
            <p>📞 Call us for immediate assistance: +91-XXXXX-XXXXX</p>
            <p>📧 Email: college-training@at-cs.com</p>
          </div>
        </div>
      </section>

      <EnrollmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        preselectedCourse="collegeTraining"
      />
      
      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default CollegeTrainingLandingPage;