function EditButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
        >
            Edit
        </button>
    );
}


function SaveButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
            Save
        </button>
    );
}

function CancelButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
            Cancel
        </button>
    );
}

function DeleteButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
            Delete
        </button>
    );
}

export { EditButton, SaveButton, CancelButton, DeleteButton };
