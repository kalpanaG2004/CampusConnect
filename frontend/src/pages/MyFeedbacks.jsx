import { useEffect, useState } from 'react';
import { formatDateTime } from '../utils/FormatDate';

function MyFeedbacks() {
    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyFeedbacks = async () => {
            try {
                const res = await fetch('http://localhost:8000/my-feedbacks', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to load your feedbacks');

                const data = await res.json();
                setMyFeedbacks(data.my_feedbacks);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyFeedbacks();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">My Submitted Feedbacks 🧾</h1>

            {loading ? (
                <p className="text-center">Loading your feedbacks...</p>
            ) : myFeedbacks.length === 0 ? (
                <p className="text-center">You haven't submitted any feedback yet.</p>
            ) : (
                <div className="space-y-6">
                    {myFeedbacks.map((fb) => (
                        <div
                            key={fb.id}
                            className="border rounded-md p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold text-lg">{fb.title}</span>
                                <span className="text-sm text-gray-500">{fb.category}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{fb.comment}</p>
                            <div className="text-sm text-gray-600">
                                ⭐ {fb.rating}/5 · {formatDateTime(fb.submitted_at)}
                                {fb.is_anonymous && <span className="italic ml-2">(Anonymous)</span>}
                            </div>
                            {/* Future Add: Edit & Delete buttons here */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyFeedbacks;
