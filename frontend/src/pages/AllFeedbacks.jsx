import { useEffect, useState } from 'react';
import { formatDateTime } from '../utils/FormatDate';

function AllFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setUserEmail(localStorage.getItem('email') || '');

    const fetchAllFeedbacks = async () => {
      try {
        const res = await fetch('http://localhost:8000/admin/feedbacks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to load feedbacks');

        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFeedbacks();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Submitted Feedbacks (Admin View) 🛠️</h1>

      {loading ? (
        <p className="text-center">Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-center">No feedbacks found.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="border rounded-md p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg font-semibold">{fb.title}</h2>
                  <p className="text-sm text-gray-500">{fb.category}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatDateTime(fb.submitted_at)}
                </span>
              </div>
              <p className="mb-2 text-gray-700">{fb.comment}</p>
              <div className="text-sm text-gray-600 mb-2">
                ⭐ {fb.rating}/5
                {fb.username && <> · by <strong>{fb.username}</strong></>}
                {fb.is_anonymous && <span className="italic ml-2">(Anonymous)</span>}
              </div>

              <div className="flex gap-3">
                {fb.email === userEmail && (
                  <button className="px-4 py-1 bg-yellow-400 rounded text-white hover:bg-yellow-500">
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllFeedbacks;
