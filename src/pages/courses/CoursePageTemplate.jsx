import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Award, Target, BookOpen, Play, CheckCircle, ArrowRight, Phone, Calendar, Download, Star, Shield, Code, Database } from 'lucide-react';
// ModernEnrollmentModal removed — enrollment uses WhatsApp contact
import WhatsAppContactButton from '@/components/WhatsAppContactButton.jsx';

const CoursePageTemplate = ({ courseData }) => {
  // enrollment modal removed; use WhatsApp contact instead
  const [activeTab, setActiveTab] = useState('overview');

  const {
    title,
    subtitle,
    description,
    keyBenefits,
    duration,
    level,
    price,
    originalPrice,
    highlights,
    features,
    curriculum,
    prerequisites,
    eligibility,
    skills,
    programs,
    testimonials,
    faqs,
    batchInfo,
    category, // 'cybersecurity' or 'technology'
    courseId
  } = courseData;

  const categoryColors = {
    cybersecurity: {
      primary: 'from-blue-600 to-purple-600',
      secondary: 'from-blue-500 to-purple-500',
      accent: 'blue-500',
      bg: 'bg-slate-900'
    },
    technology: {
      primary: 'from-emerald-600 to-teal-600',
      secondary: 'from-emerald-500 to-teal-500',
      accent: 'emerald-500',
      bg: 'bg-slate-800'
    }
  };

  const colors = categoryColors[category] || categoryColors.cybersecurity;

  const handleEnrollment = (programType = 'premium') => {
    const msg = `Hi, I want to enroll in ${title}. Please share pricing and next steps.`;
    window.open('https://wa.me/919160813700?text=' + encodeURIComponent(msg), '_blank');
  };

  return (
    <div className={`min-h-screen text-white ${colors.bg}`}>
      {/* Hero Section */}
      <section className={`relative py-20 bg-gradient-to-r ${colors.primary}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-8">
                {subtitle}
              </p>

              {/* Key Benefits */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-slate-200">What You will Master:</h3>
                <ul className="space-y-2">
                  {keyBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-slate-200">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleEnrollment()}
                    className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                  >
                    Enroll Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                  <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors duration-200 flex items-center justify-center">
                    <Phone className="mr-2 w-5 h-5" />
                    Call: +91 9515151992
                  </button>
                </div>

                {/* WhatsApp Hero CTA */}
                <WhatsAppContactButton
                  variant="inline"
                  courseContext={title}
                  className="w-full sm:w-auto"
                />
              </div>
            </motion.div>

            {/* Right Content - Course Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Course Details</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Duration:</span>
                  <span className="text-white font-semibold">{duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Level:</span>
                  <span className="text-white font-semibold">{level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Format:</span>
                  <span className="text-white font-semibold">Online & Offline</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Price:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-400">{price}</span>
                    {originalPrice && (
                      <span className="text-slate-400 line-through ml-2">{originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Batch Info */}
              {batchInfo && (
                <div className="border-t border-white/20 pt-6">
                  <h4 className="font-semibold text-white mb-4">Upcoming Batch</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date: {batchInfo.date}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Clock className="w-4 h-4 mr-2" />
                      Time: {batchInfo.time}
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-colors duration-200">
                Register For Free Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Master {title} Training Overview
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Key Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colors.secondary} flex items-center justify-center mx-auto mb-4`}>
                  <highlight.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{highlight.title}</h3>
                <p className="text-slate-300">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Features */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Course Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start">
                  <div className={`w-12 h-12 rounded-lg bg-${colors.accent}/20 flex items-center justify-center mr-4 flex-shrink-0`}>
                    <CheckCircle className={`w-6 h-6 text-${colors.accent}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Covered */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Skills Covered</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <div key={index} className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                  <span className="text-slate-200 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs & Pricing */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Training Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-8 border border-slate-700 relative">
                {program.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-4">{program.name}</h3>
                <div className="text-3xl font-bold text-green-400 mb-6">{program.price}</div>
                <ul className="space-y-3 mb-8">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-slate-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleEnrollment(program.type)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    program.popular
                      ? `bg-gradient-to-r ${colors.primary} text-white hover:opacity-90`
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Curriculum */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Course Curriculum</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {curriculum.map((module, index) => (
                <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {String(index + 1).padStart(2, '0')}: {module.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {module.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center text-slate-300">
                        <div className={`w-2 h-2 rounded-full bg-${colors.accent} mr-3 flex-shrink-0`}></div>
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites & Eligibility */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Prerequisites</h2>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-300 leading-relaxed">{prerequisites}</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Eligibility</h2>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <ul className="space-y-3">
                  {eligibility.map((item, index) => (
                    <li key={index} className="flex items-center text-slate-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-800 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTab(activeTab === `faq-${index}` ? '' : `faq-${index}`)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-700 rounded-xl transition-colors duration-200"
                >
                  <span className="text-white font-semibold">{faq.question}</span>
                  <ArrowRight className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${activeTab === `faq-${index}` ? 'rotate-90' : ''}`} />
                </button>
                {activeTab === `faq-${index}` && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-16 bg-gradient-to-r ${colors.primary}`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your {title} Journey?
          </h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Join thousands of successful professionals who have transformed their careers with our comprehensive training program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleEnrollment()}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
            >
              Enroll Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors duration-200 inline-flex items-center justify-center">
              <Download className="mr-2 w-5 h-5" />
              Download Curriculum
            </button>
          </div>
        </div>
      </section>

      {/* Modern Enrollment Modal */}
      {/* Enrollment modal removed; use WhatsApp for enrollments */}

      {/* WhatsApp Contact Button - Floating */}
      <WhatsAppContactButton
        variant="floating"
        courseContext={title}
        showQuickActions={true}
      />
    </div>
  );
};

export default CoursePageTemplate;