import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FeedbackForm from '../components/FeedbackForm';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    role: ''
  });

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const tokenData = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (!tokenData) {
      navigate('/login'); // fallback, in case ProtectedRoute was bypassed somehow
    } else {
      setUser({ email, role });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col items-center pt-20">
      {/* Top Bar */}
      <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome, <strong>{user.email}</strong> ({user.role})
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Feedback Options */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Submit Your Feedback</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedCategory("faculty")}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded"
          >
            🧑‍🏫 Faculty Feedback
          </button>
          <button
            onClick={() => setSelectedCategory("event")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            🎉 Event Feedback
          </button>
          <button
            onClick={() => setSelectedCategory("club")}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
          >
            🎭 Club Feedback
          </button>
          <button
            onClick={() => setSelectedCategory("infrastructure")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
          >
            🏢 Infrastructure Feedback
          </button>
          <button
            onClick={() => setSelectedCategory("other")}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded"
          >
            ✍️ Other Feedback
          </button>
        </div>
      </div>

      {/* Form Area */}
      {selectedCategory && (
        <div className="w-full max-w-2xl">
          <FeedbackForm category={selectedCategory} />
        </div>
      )}
      <div>
        <Link to="/my-feedbacks" className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500">
          My Feedbacks
        </Link>

        {localStorage.getItem("role") === "admin" && (
          <Link to="/all-feedbacks" className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500">
            All Feedbacks (Admin View)
          </Link>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
