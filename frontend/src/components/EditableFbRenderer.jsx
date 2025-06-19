import { formatDateTime } from '../utils/FormatDate';
import { EditButton, SaveButton, CancelButton, DeleteButton } from './ActionButtons';

function EditableFbRenderer({
    loading = false,
    data = [],
    editable = false,
    editingId,
    editedFeedback,
    onEditStart,
    onCancel,
    onChange,
    onSave,
    onDelete,
    saveChanges,
    cancelEditing,
}) {
    return loading ? (
        <p className="text-center">Loading feedbacks...</p>
    ) : !data || data.length === 0 ? (
        <p className="text-center">No feedbacks found.</p>
    ) : (
        <div className="space-y-6">
            {data.map((fb) => (
                <div key={fb.id} className="border rounded-md p-4 shadow-sm hover:shadow-md transition">
                    {editable && editingId === fb.id ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveChanges();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') cancelEditing();
                            }}
                        >
                            <input
                                type="text"
                                value={editedFeedback.title}
                                onChange={(e) => onChange('title', e.target.value)}
                                className="block w-full mb-2 border rounded p-2"
                            />
                            <textarea
                                value={editedFeedback.comment}
                                onChange={(e) => onChange('comment', e.target.value)}
                                className="block w-full mb-2 border rounded p-2"
                            />
                            <input
                                type="number"
                                value={editedFeedback.rating}
                                onChange={(e) => onChange('rating', parseInt(e.target.value))}
                                className="block w-full mb-2 border rounded p-2"
                            />
                            <div className="flex gap-2">
                                <SaveButton onClick={onSave} />
                                <CancelButton onClick={onCancel} />
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold text-lg">{fb.title}</span>
                                <span className="text-sm text-gray-500">{fb.category}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{fb.comment}</p>
                            <div className="text-sm text-gray-600">
                                ⭐ {fb.rating}/5 · {formatDateTime(fb.submitted_at)}
                                {fb.is_anonymous && <span className="italic ml-2">(Anonymous)</span>}
                                {fb.username && <> · by <strong>{fb.username}</strong></>}
                            </div>
                            <div className="flex gap-2 mt-2">
                                {editable && <EditButton onClick={() => onEditStart(fb.id, fb)} />}
                                <DeleteButton onClick={() => onDelete(fb.id)} />
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default EditableFbRenderer;
