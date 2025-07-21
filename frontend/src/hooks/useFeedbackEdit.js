import { useState } from 'react';
import { apiRequest } from '../../config/api';

export function useFeedbackEdit(myFeedbacks, setMyFeedbacks) {
  const [editingId, setEditingId] = useState(null);
  const [editedFeedbacks, setEditedFeedbacks] = useState({});
  const token = localStorage.getItem('token');

  const startEditing = (id, feedbackData) => {
    setEditingId(id);
    setEditedFeedbacks({ ...feedbackData }); // Pre-fill form with passed feedback data
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedFeedbacks(null);
  };

  const updateField = (field, value) => {
    setEditedFeedbacks((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const saveChanges = async () => {
    try {
      const res = await apiRequest(`/feedbacks/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedFeedbacks),
      });

      if (!res.ok) throw new Error('Failed to update feedback');

      const updatedRes = await apiRequest(`/feedbacks/${editingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = await updatedRes.json();
      const categoryToPreserve = editedFeedbacks.category ?? myFeedbacks.find(fb => fb.id === editingId)?.category;

      // Stripping username to maintain original MyFeedbacks behavior
      // and preserving disappearing category
      const sanitizedData = {
        ...updatedData,
        category: updatedData.category || categoryToPreserve
      };
      delete sanitizedData.username;

      setMyFeedbacks(prev =>
        prev.map(fb => fb.id === editingId ? sanitizedData : fb)
      );

      cancelEditing();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteFeedback = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirm) return;

    try {
      const res = await apiRequest(`/feedbacks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete feedback');

      setMyFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return {
    editingId,
    editedFeedbacks,
    startEditing,
    cancelEditing,
    updateField,
    saveChanges,
    deleteFeedback,
  };
}
