import { useEffect, useState } from 'react';
import { useFeedbackEdit } from '../hooks/useFeedbackEdit';
import SearchAndFilter from '../components/SearchAndFilter';
import EditableFbRenderer from '../components/EditableFbRenderer';
import { apiRequest } from '../config/api'

function AllFeedbacks() {
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const token = localStorage.getItem('token');

  const {
    deleteFeedback,
  } = useFeedbackEdit(myFeedbacks, setMyFeedbacks);

  useEffect(() => {

    const fetchAllFeedbacks = async () => {
      try {
        const res = await apiRequest('/admin/feedbacks', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to load feedbacks');

        const data = await res.json();
        setMyFeedbacks(data);
        setFiltered(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFeedbacks();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">All Feedbacks (Admin View) 🛠️</h1>

      <SearchAndFilter feedbacks={myFeedbacks} onFilter={setFiltered} />

      <EditableFbRenderer
        loading={loading}
        data={filtered}
        editable={false}
        onDelete={deleteFeedback}
      />

    </div>
  );
}

export default AllFeedbacks;
