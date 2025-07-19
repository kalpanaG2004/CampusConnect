import { apiRequest } from '../config/api.js';

export async function fetchHighlights() {
    try {
        const response = await apiRequest('/analytics/highlights');
        if (!response.ok) throw new Error('Failed to fetch highlights');
        const data = await response.json();
        return data.highlights;
    } catch (error) {
        console.error('Error fetching highlights:', error);
        return [];
    }
}

export async function fetchSummary() {
    try {
        const response = await apiRequest('/analytics/summary');
        if (!response.ok) throw new Error('Failed to fetch summary');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching summary:', error);
        return { total_feedbacks: 0, total_users: 0, category_counts: {} };
    }
}

export async function fetchTeasers() {
    try {
        const response = await apiRequest('/analytics/teasers');
        if (!response.ok) throw new Error('Failed to fetch teaser cards');
        const data = await response.json();
        return data.teasers;
    } catch (error) {
        console.error('Error fetching teaser cards:', error);
        return [];
    }
}
