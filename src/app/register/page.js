'use client'

import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    avatar: null, // handle file properly
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'avatar') {
      setForm({ ...form, avatar: files[0] }); // grab the selected file
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('avatar', form.avatar); // append file

    try {
      const res = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || 'Registration done!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to register');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="fullName"
          placeholder="FullName"
          value={form.fullName}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        /><br /><br />
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
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
          required
        /><br /><br />
        <input type="submit" value="Register" />
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
