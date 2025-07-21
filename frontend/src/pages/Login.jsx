import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../config/api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.email || !formData.password) return alert("Please fill in all fields");

    try {
      setLoading(true);

      // Prepare data for OAuth2PasswordRequestForm
      const formBody = new URLSearchParams();
      formBody.append("username", formData.email);
      formBody.append("password", formData.password);

      const res = await apiRequest("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Save JWT + user info in localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      alert("Login successful!");
      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 text-left">
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
      <button
        type="submit"
        className="bg-[#3A8F50] hover:bg-[#A3D977] text-white px-6 py-2 rounded-lg font-semibold transition-colors mt-2"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default Login;
