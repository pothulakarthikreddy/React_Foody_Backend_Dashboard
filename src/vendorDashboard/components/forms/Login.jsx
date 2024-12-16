import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For error feedback

  const loginHandler = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
  
    if (!email || !password) {
      setError('Email and Password are required');
      return;
    }
  
    try {
      // Login API request
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Login successful');
        setEmail('');
        setPassword('');
        localStorage.setItem('loginToken', data.token);
        console.log('Login token stored:', localStorage.getItem('loginToken'));
        showWelcomeHandler();
  
        if (!data.vendorId) {
          setError('Vendor ID not found in the response.');
          return;
        }
  
        console.log('Vendor ID received:', data.vendorId);
  
        // Fetch vendor details
        const token = data.token; // Ensure token is correctly passed
        const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${data.vendorId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in the Authorization header
            'Content-Type': 'application/json',
          },
        });
  
        let vendorData;
        try {
          vendorData = await vendorResponse.json();
          console.log('Vendor Data:', vendorData); // Debugging log
        } catch (error) {
          console.error('Error parsing JSON from vendor details response:', error);
          setError('Failed to fetch vendor details. Invalid response from server.');
          return;
        }
  
        if (vendorResponse.ok && vendorData.vendor) {
          if (Array.isArray(vendorData.vendor.firm) && vendorData.vendor.firm.length > 0) {
            const vendorFirmId = vendorData.vendor.firm[0]._id; // Correct ID access
            const vendorFirmName = vendorData.vendor.firm[0].firmName; // Correct name access
  
            console.log('Firm Name:', vendorFirmName);
            console.log('Firm ID:', vendorFirmId);
  
            // Store firm details in localStorage
            localStorage.setItem('firmId', vendorFirmId);
            localStorage.setItem('firmName', vendorFirmName);
            window.location.reload();
  
            // Confirm that localStorage is updated
            console.log('Firm ID stored in localStorage:', localStorage.getItem('firmId'));
          } else {
            console.warn('No firm information found for this vendor.');
          }
        } else {
          console.error('Failed to fetch vendor details:', vendorData.message || 'Unknown error');
          setError(vendorData.message || 'Failed to fetch vendor details.');
        }
      } else {
        console.error('Login failed:', data.message || 'Unknown error');
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };
  
  
  
  

  return (
    <div className="loginSection">
      <form className="authForm" onSubmit={loginHandler}>
        <h3>Vendor Login</h3>
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email.."
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Your Password.."
        />
        <br />
        <div className="btnSubmit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
