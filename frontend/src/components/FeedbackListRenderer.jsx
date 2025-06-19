import { formatDateTime } from '../utils/FormatDate';

function FeedbackListRenderer({ loading, data = [] }) {
    return loading ? (
        <p className="text-center">Loading feedbacks...</p>
    ) : data.length === 0 ? (
        <p className="text-center">No feedbacks found.</p>
    ) : (
        <div className="space-y-6">
            {data.map((fb, index) => (
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
    )
}

export default FeedbackListRenderer;
