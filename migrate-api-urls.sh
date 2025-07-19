#!/bin/bash

echo "🔄 Migrating API URLs for Firebase IDX compatibility..."

# Files that need API configuration import
FILES_NEEDING_IMPORT=(
    "frontend/src/pages/Login.jsx"
    "frontend/src/pages/Signup.jsx"
    "frontend/src/pages/MyFeedbacks.jsx"
    "frontend/src/pages/AllFeedbacks.jsx"
    "frontend/src/pages/PublicFeedbacks.jsx"
    "frontend/src/components/FeedbackForm.jsx"
    "frontend/src/hooks/useFeedbackEdit.js"
)

# Add import statement to files that need it
for file in "${FILES_NEEDING_IMPORT[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Adding API import to $file"
        # Check if import already exists
        if ! grep -q "import.*apiRequest.*from.*config/api" "$file"; then
            # Add import after the first import line
            sed -i "1a import { apiRequest } from '../config/api.js';" "$file"
        fi
    fi
done

# Replace hardcoded URLs with apiRequest calls
echo "🔧 Replacing hardcoded API URLs..."

# Pattern 1: Simple fetch with localhost:8000
find frontend/src -name "*.js" -o -name "*.jsx" | xargs sed -i 's|fetch(\s*['"'"'"]\s*http://localhost:8000\([^'"'"'"]*\)['"'"'"]\s*)|apiRequest(\1)|g'

# Pattern 2: fetch with options object
find frontend/src -name "*.js" -o -name "*.jsx" | xargs sed -i 's|fetch(\s*['"'"'"]\s*http://localhost:8000\([^'"'"'"]*\)['"'"'"]\s*,\s*{|apiRequest(\1, {|g'

# Fix any remaining localhost:8000 references in template literals
find frontend/src -name "*.js" -o -name "*.jsx" | xargs sed -i 's|`http://localhost:8000\([^`]*\)`|`${API_BASE_URL}\1`|g'

# Also need to import API_BASE_URL for template literals
find frontend/src -name "*.js" -o -name "*.jsx" | xargs grep -l 'API_BASE_URL' | while read file; do
    if ! grep -q "import.*API_BASE_URL.*from.*config/api" "$file"; then
        sed -i "1a import { API_BASE_URL } from '../config/api.js';" "$file"
    fi
done

echo "✅ API URL migration complete!"
echo ""
echo "📋 Manual steps still needed:"
echo "1. Review the updated files to ensure fetch calls have proper credentials"
echo "2. Test the application in Firebase IDX"
echo "3. Update any custom fetch configurations to use apiRequest helper"
echo ""
echo "💡 The apiRequest helper automatically:"
echo "   - Adds credentials: 'include' for Firebase IDX auth"
echo "   - Sets Content-Type to application/json"
echo "   - Handles API base URL detection"