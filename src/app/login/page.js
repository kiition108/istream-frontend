'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/Authcontext';


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [message, setMessage] = useState('');
  const { setUser } = useAuth()
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/v1/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const response = await res.json();
      console.log(response)
      if (res.ok) {
        setMessage(response.message);
        setUser(response.data.user)
        localStorage.setItem('token', response.data.accessToken); // store JWT token
        

        setTimeout(() => {
          router.push('/'); 
        }, 1000);
      } 
      else {
        setMessage(response.message);
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        /><br /><br />

        <label>
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />
          Remember me
        </label><br /><br />

        <input type="submit" value="Login" />
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
