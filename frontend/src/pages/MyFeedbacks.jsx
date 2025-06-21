import { useEffect, useState } from 'react';
import { useFeedbackEdit } from '../hooks/useFeedbackEdit';
import SearchAndFilter from '../components/SearchAndFilter';
import EditableFbRenderer from '../components/EditableFbRenderer';

function MyFeedbacks() {
    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState([]);
    const token = localStorage.getItem('token');

    const {
        editingId,
        editedFeedbacks,
        startEditing,
        cancelEditing,
        updateField,
        saveChanges,
        deleteFeedback,
    } = useFeedbackEdit(myFeedbacks, setMyFeedbacks);

    useEffect(() => {
        const fetchMyFeedbacks = async () => {
            try {
                const res = await fetch('http://localhost:8000/my-feedbacks', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to load your feedbacks');

                const data = await res.json();
                setMyFeedbacks(data.my_feedbacks);
                setFiltered(data.my_feedbacks);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyFeedbacks();
    }, [token, setMyFeedbacks]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">My Feedbacks 🧾</h1>

            <SearchAndFilter feedbacks={myFeedbacks} onFilter={setFiltered} />

            <EditableFbRenderer
                loading={loading}
                data={filtered}
                editable={true}
                editingId={editingId}
                editedFeedback={editedFeedbacks}
                onEditStart={startEditing}
                onCancel={cancelEditing}
                onChange={updateField}
                onDelete={deleteFeedback}
                saveChanges={saveChanges}
                cancelEditing={cancelEditing}
            />

        </div>
    );
}

export default MyFeedbacks;
