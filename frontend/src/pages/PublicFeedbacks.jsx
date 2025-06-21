import { useEffect, useState } from 'react';
import SearchAndFilter from '../components/SearchAndFilter';
import FeedbackListRenderer from '../components/FeedbackListRenderer';

function PublicFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await fetch('http://localhost:8000/feedbacks');
                if (!res.ok) throw new Error('Failed to load feedbacks');
                const data = await res.json();
                setFeedbacks(data);
                setFiltered(data);
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

            <SearchAndFilter feedbacks={feedbacks} onFilter={setFiltered} />

            <FeedbackListRenderer
                loading={loading}
                data={filtered}
            />

        </div>
    );
}

export default PublicFeedbacks;
