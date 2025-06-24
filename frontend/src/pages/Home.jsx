import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchHighlights } from '../api/analytics';

function Home() {
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    async function getHighlights() {
      const fetchedData = await fetchHighlights();
      setHighlights(fetchedData);
    }
    getHighlights();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Campus Connect 🎓</h1>
      <p className="text-gray-600">Your feedback, your voice, your impact.</p>
      <Link to="/feedbacks" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
        View Feedbacks
      </Link>

      <h2 className="text-2xl font-bold mb-4 text-forest-green">Feedback Highlights</h2>
      <div className="flex flex-wrap gap-4">
        {highlights.length > 0 ? (
          highlights.map((feedback, index) => (
            <div key={index} className="bg-white/70 backdrop-blur p-4 rounded shadow w-72">
              <h3 className="font-semibold">{feedback.title}</h3>
              <p className="text-gray-700 text-sm">{feedback.comment}</p>
              <p className="text-sm mt-2">Rating: {feedback.rating} / 5</p>
              <p className="text-sm">
                {feedback.is_anonymous ? '' : `By ${feedback.username}`}
              </p>
            </div>
          ))
        ) : (
          <p>No highlights available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
