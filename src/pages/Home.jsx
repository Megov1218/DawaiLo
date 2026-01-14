import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const [activePortal, setActivePortal] = useState(null);

  const portals = [
    {
      id: 'doctor',
      title: '🩺 Doctor Portal',
      color: 'from-blue-400 to-blue-600',
      hoverColor: 'hover:from-blue-500 hover:to-blue-700',
      description: 'Create digital prescriptions with precision',
      features: [
        'Search and select patients',
        'Add medicines with exact dosage',
        'Set frequency and intake times',
        'Define treatment duration',
        'Update prescriptions anytime'
      ],
      icon: '🩺'
    },
    {
      id: 'pharmacist',
      title: '💊 Pharmacist Portal',
      color: 'from-green-400 to-green-600',
      hoverColor: 'hover:from-green-500 hover:to-green-700',
      description: 'View prescriptions for accurate dispensing',
      features: [
        'Search patients instantly',
        'View complete prescription details',
        'See doctor information',
        'No more handwriting confusion',
        'Dispense with confidence'
      ],
      icon: '💊'
    },
    {
      id: 'patient',
      title: '👤 Patient Portal',
      color: 'from-purple-400 to-purple-600',
      hoverColor: 'hover:from-purple-500 hover:to-purple-700',
      description: 'Track your medicine adherence effortlessly',
      features: [
        'View prescribed medicines',
        'Get timely notifications',
        'Mark doses taken or missed',
        'Track adherence history',
        'Stay on schedule'
      ],
      icon: '👤'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💊</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            DawaiLo
          </h1>
        </div>
        <Link
          to="/login"
          className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          Login
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Content */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Medicine Management,
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Done Right
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            A prescription-driven system connecting doctors, pharmacists, and patients.
            <span className="block mt-2 font-semibold text-purple-600">
              One prescription. One truth. Zero confusion.
            </span>
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
            >
              Get Started →
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg">
                🩺
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">Doctor Prescribes</h4>
              <p className="text-gray-600 max-w-xs">Digital prescription with exact details</p>
            </div>
            
            <div className="text-4xl text-purple-400 hidden md:block">→</div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg">
                💊
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">Pharmacist Dispenses</h4>
              <p className="text-gray-600 max-w-xs">Clear prescription, accurate dispensing</p>
            </div>
            
            <div className="text-4xl text-purple-400 hidden md:block">→</div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg">
                👤
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">Patient Tracks</h4>
              <p className="text-gray-600 max-w-xs">Adherence tracking with reminders</p>
            </div>
          </div>
        </div>

        {/* Interactive Portals */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explore Our Portals
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {portals.map((portal) => (
              <div
                key={portal.id}
                onMouseEnter={() => setActivePortal(portal.id)}
                onMouseLeave={() => setActivePortal(null)}
                className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer ${
                  activePortal === portal.id ? 'scale-105 shadow-2xl' : 'hover:shadow-xl'
                }`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${portal.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md`}>
                  {portal.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{portal.title}</h4>
                <p className="text-gray-600 mb-4">{portal.description}</p>
                
                <div className={`transition-all duration-300 overflow-hidden ${
                  activePortal === portal.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <ul className="space-y-2">
                    {portal.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why DawaiLo?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🎯</div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Accuracy</h4>
              <p className="text-gray-600">No handwriting errors</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🔒</div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Security</h4>
              <p className="text-gray-600">Role-based access control</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Tracking</h4>
              <p className="text-gray-600">Complete adherence history</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🔔</div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Reminders</h4>
              <p className="text-gray-600">Never miss a dose</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join the future of medicine management today
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-white text-purple-600 font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
          >
            Launch DawaiLo →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p>© 2026 DawaiLo - Medicine Management System</p>
        <p className="text-sm mt-2">Prescription-driven. Patient-focused. Pharmacist-friendly.</p>
      </footer>
    </div>
  );
}
