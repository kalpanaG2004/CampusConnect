import { useEffect, useState } from 'react';
import { formatDateTime } from '../utils/FormatDate';

function PublicFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await fetch('http://localhost:8000/feedbacks');
                if (!res.ok) throw new Error('Failed to load feedbacks');
                const data = await res.json();
                setFeedbacks(data);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">What Students Are Saying 💬</h1>

            {loading ? (
                <p className="text-center">Loading feedbacks...</p>
            ) : feedbacks.length === 0 ? (
                <p className="text-center">No feedbacks submitted yet.</p>
            ) : (
                <div className="space-y-6">
                    {feedbacks.map((fb, index) => (
                        <div
                            key={index}
                            className="border rounded-md p-4 shadow-sm hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-lg">{fb.title}</span>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">{fb.category}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{fb.comment}</p>
                            <div className="text-sm text-gray-600">
                                ⭐ {fb.rating}/5 · Submitted {formatDateTime(fb.submitted_at)}
                                {fb.username && <> · by <strong>{fb.username}</strong></>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PublicFeedbacks;
