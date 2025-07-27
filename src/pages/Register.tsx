// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // For styling
import { register } from '../services/apiService'; // Import the register function

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(''); // Changed from dob to age
  const [mobile, setMobile] = useState('');
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState(''); // NEW: Email field
  const [maritalStatus, setMaritalStatus] = useState('');
  const [city, setCity] = useState('');
  const [careerStage, setCareerStage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation for age
    if (typeof age !== 'number' || age <= 0) {
      setError('Please enter a valid age.');
      setLoading(false);
      return;
    }

    try {
      // Pass all new fields to the register function
      const response = await register({
        name,
        mobile_no: mobile,
        age, // Changed
        preferred_language: language,
        marrital_status: maritalStatus, // New
        city,          // New
        career_stage: careerStage,
        email,  // New
      });
      console.log('Registration successful:', response);
      alert('Registration successful! Please sign in.');
      navigate('/signin');
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number:</label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label> {/* Changed from dob */}
          <input
            type="number" // Changed type to number
            id="age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value) || '')} // Parse to int
            required
            disabled={loading}
            min="1" // Minimum age
          />
        </div>
        <div className="form-group">
          <label htmlFor="maritalStatus">Marital Status:</label> {/* NEW FIELD */}
          <select
            id="maritalStatus"
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Select...</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label> {/* NEW FIELD */}
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="careerStage">Career Stage:</label> {/* NEW FIELD */}
          <select
            id="careerStage"
            value={careerStage}
            onChange={(e) => setCareerStage(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Select...</option>
            <option value="early-career">Early-Career</option>
            <option value="mid-career">Mid-Career</option>
            <option value="retirement">Retirement</option>
            <option value="student">Student</option> {/* Added student as common option */}
            <option value="unemployed">Unemployed</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="language">Language Preference:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="error-message">{error}</p>}

        <p className="auth-link-text">
          Already have an account? <Link to="/signin">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;