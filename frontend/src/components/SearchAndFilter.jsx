import { useState, useEffect } from 'react';

export default function SearchAndFilter({feedbacks = [], onFilter}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const CATEGORIES = ['All', 'event', 'club', 'faculty', 'infrastructure'];

    useEffect(() => {
        let results = feedbacks;

        if (selectedCategory !== 'All') {
            results = results.filter((fb) => fb.category === selectedCategory);
        }

        if (searchTerm.trim() !== '') {
            const lower = searchTerm.toLowerCase();
            results = results.filter(
                (fb) =>
                    fb.title.toLowerCase().includes(lower) ||
                    fb.comment.toLowerCase().includes(lower)
            );
        }

        onFilter(results);
    }, [feedbacks, searchTerm, selectedCategory, onFilter]);

    return (
        <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between">
            <input
                type="text"
                placeholder="Search feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        setSearchTerm('');
                        e.target.blur();
                    }
                }}
                className="border px-3 py-2 rounded w-full sm:w-2/3"
            />
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border px-3 py-2 rounded w-full sm:w-1/3"
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
        </div>
    );
}