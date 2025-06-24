export async function fetchHighlights() {
    try {
        const response = await fetch('http://localhost:8000/analytics/highlights');
        if (!response.ok) throw new Error('Failed to fetch highlights');
        const data = await response.json();
        return data.highlights;
    } catch (error) {
        console.error('Error fetching highlights:', error);
        return [];
    }
}
