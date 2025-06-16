import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Campus Connect 🎓</h1>
      <p className="text-gray-600">Your feedback, your voice, your impact.</p>
      <Link to="/feedbacks" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
        View Public Feedbacks
      </Link>
    </div>
  );
}

export default Home;
