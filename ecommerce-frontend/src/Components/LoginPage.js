import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Adjust the URL if needed (backend URL and port)
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      
      // Save token (if needed) in localStorage
      localStorage.setItem('token', response.data.token);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label> <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '250px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label> <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '250px' }}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginPage;
