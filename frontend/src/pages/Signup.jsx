import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Signup() {
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
  const navigate = useNavigate();

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
    if (!formData.username.trim()) {
      alert('Username is required');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      alert('Enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

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
      const res = await fetch('http://localhost:8000/register', {
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

      alert("Registration successful! Redirecting to login...");
      navigate("/login");


    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter a username"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter password"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Re-enter password"
            required
          />
        </div>

        <div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          {formData.role === "admin" && (
            <input
              name="adminCode"
              type="text"
              placeholder="Admin Code"
              value={formData.adminCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Registering..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
