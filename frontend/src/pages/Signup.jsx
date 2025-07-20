import { useState } from 'react';
import { apiRequest } from '../config/api.js';

function Signup({ onSuccess }) {
  // Store form inputs
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    adminCode: ''
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FRONTEND VALIDATIONS
    if (!formData.username.trim()) return alert('Username is required');
    if (!formData.email.includes('@') || !formData.email.includes('.')) return alert('Enter a valid email address');
    if (formData.password.length < 6) return alert('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');

    const payload = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === 'admin') {
      payload.admin_code = formData.adminCode;
    }

    try {
      setLoading(true);
      const res = await apiRequest('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      onSuccess();

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0 text-left">
      <label htmlFor="email" className="block text-sm font-medium text-[#2F3E2E] mb-1">Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        className="p-2 rounded border mb-2"
        required
      />
      <label htmlFor="username" className="block text-sm font-medium text-[#2F3E2E] mb-1">Username</label>
      <input
        type="text"
        name="username"
        placeholder="Enter your username"
        value={formData.username}
        onChange={handleChange}
        className="p-2 rounded border mb-2"
        required
      />
      <label htmlFor="password" className="block text-sm font-medium text-[#2F3E2E] mb-1">Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter the Password"
        value={formData.password}
        onChange={handleChange}
        className="p-2 rounded border mb-2"
        required
      />
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2F3E2E] mb-1">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Re-enter the Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="p-2 rounded border mb-2"
        required
      />
      <label htmlFor="role" className="block text-sm font-medium text-[#2F3E2E] mb-1">Select your Role</label>
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="p-2 rounded border mb-2"
      >
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      {formData.role === "admin" && (
        <>
          <label htmlFor="role" className="block text-sm font-medium text-[#2F3E2E] mb-1">Admin Code</label>
          <input
            type="password"
            name="adminCode"
            placeholder="Enter the Admin Code"
            value={formData.adminCode}
            onChange={handleChange}
            className="p-2 rounded border mb-2"
          />
        </>
      )}
      <button
        type="submit"
        className="bg-[#3A8F50] hover:bg-[#A3D977] text-white px-6 py-2 rounded-lg font-semibold transition-colors mt-2"
        disabled={loading}
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
}

export default Signup;
