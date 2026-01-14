import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { authenticateUser } from '../utils/storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAppStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = authenticateUser(email, password);
    
    if (user) {
      login(user);
      navigate(`/${user.role}`);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">💊</span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            DawaiLo
          </h1>
        </div>
        <p className="text-gray-600 mb-6">Medicine Management System</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
              required
            />
          </div>

          {error && <p className="text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 transform shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-sm border-2 border-purple-200">
          <p className="font-semibold mb-2 text-purple-900">Test Credentials:</p>
          <p className="text-gray-700">Doctor: doctor@test.com / doctor123</p>
          <p className="text-gray-700">Pharmacist: pharmacist@test.com / pharma123</p>
          <p className="text-gray-700">Patient: patient@test.com / patient123</p>
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/" className="text-purple-600 font-semibold hover:text-purple-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
