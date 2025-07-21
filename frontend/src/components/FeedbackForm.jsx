import { useState } from 'react';
import { API_BASE_URL } from '../config/api.js';
import { apiRequest } from '../config/api.js';

function FeedbackForm({ category }) {
    const [formData, setFormData] = useState({
        title: '',
        comment: '',
        rating: 3,
        is_anonymous: false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.comment.trim()) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/feedback/${category}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json();
                if (err.detail && Array.isArray(err.detail)) {
                    const messages = err.detail.map(e => `${e.loc?.[1] || 'Field'}: ${e.msg}`);
                    throw new Error(messages.join('\n'));
                } else {
                    throw new Error(err.detail || 'Something went wrong');
                }

            }

            alert("Feedback submitted successfully!");
            setFormData({
                title: '',
                comment: '',
                rating: 3,
                is_anonymous: false,
            });

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 shadow-md rounded px-6 py-6 space-y-4">
            <h3 className="text-lg font-semibold capitalize mb-2">{category} Feedback</h3>

            <div>
                <label className="block mb-1 font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Feedback title..."
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">Comment</label>
                <textarea
                    name="comment"
                    rows="4"
                    value={formData.comment}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Write your feedback in detail..."
                ></textarea>
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">Rating</label>
                <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                >
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num} Star{num > 1 && 's'}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="is_anonymous"
                    checked={formData.is_anonymous}
                    onChange={handleChange}
                    id="anonCheck"
                    className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="anonCheck" className="text-gray-700 text-sm">
                    Submit anonymously
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 w-full"
            >
                {loading ? "Submitting..." : "Submit Feedback"}
            </button>
        </form>
    );
}

export default FeedbackForm;
