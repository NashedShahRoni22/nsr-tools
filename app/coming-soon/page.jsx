"use client";
import React, { useState } from 'react';
import { Rocket, Zap, Star, Sparkles, Mail, Bell } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated floating elements */}
      <div className="absolute top-10 left-10 animate-bounce">
        <Star className="text-yellow-400" size={40} style={{ animation: 'bounce 3s infinite' }} />
      </div>
      <div className="absolute top-20 right-20 animate-pulse">
        <Sparkles className="text-purple-400" size={35} style={{ animation: 'pulse 2s infinite' }} />
      </div>
      <div className="absolute bottom-20 left-20 animate-bounce" style={{ animationDelay: '1s' }}>
        <Zap className="text-blue-400" size={45} />
      </div>
      <div className="absolute bottom-10 right-10 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <Star className="text-pink-400" size={30} />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Animated Rocket Icon */}
        <div className="mb-8 inline-block animate-bounce">
          <div className="relative">
            <Rocket 
              size={120} 
              className="text-purple-600 mx-auto"
              style={{ 
                animation: 'bounce 2s infinite, rotate 3s infinite ease-in-out',
              }} 
            />
            <div className="absolute -top-2 -right-2 animate-ping">
              <Sparkles size={30} className="text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Title with animation */}
        <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 animate-fade-in-down">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-4 animate-fade-in-up">
          Something Amazing is Under Construction
        </p>
        <p className="text-lg text-gray-500 mb-12 animate-fade-in">
          We're working hard to bring you something incredible. Stay tuned! 🚀
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            { icon: <Zap size={40} />, title: 'Lightning Fast', desc: 'Optimized for speed' },
            { icon: <Star size={40} />, title: 'Feature Rich', desc: 'Packed with features' },
            { icon: <Sparkles size={40} />, title: 'Beautiful UI', desc: 'Modern design' }
          ].map((item, index) => (
            <div 
              key={item.title}
              className="bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all hover:scale-105 hover:shadow-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-purple-600 mx-auto mb-4 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Email Notification */}
        <div className="max-w-md mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Bell className="text-purple-600 animate-swing" size={28} />
            Get Notified
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to know when we launch!
          </p>
          
          {submitted ? (
            <div className="bg-green-100 border-2 border-green-400 text-green-700 p-4 rounded-xl animate-bounce-in flex items-center justify-center gap-2">
              <Sparkles size={20} />
              <span className="font-semibold">Thanks! We'll notify you soon! 🎉</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-all hover:scale-105 hover:shadow-lg"
              >
                Notify Me
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full animate-progress"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social, index) => (
            <button
              key={social}
              className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center text-purple-600 font-bold animate-bounce-in"
              style={{ animationDelay: `${1 + index * 0.1}s` }}
            >
              {social[0]}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progress {
          from {
            width: 0;
          }
          to {
            width: 75%;
          }
        }

        @keyframes swing {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(15deg);
          }
          75% {
            transform: rotate(-15deg);
          }
        }

        @keyframes rotate {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out both;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out both;
        }

        .animate-progress {
          animation: progress 2s ease-out;
        }

        .animate-swing {
          animation: swing 2s infinite ease-in-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}