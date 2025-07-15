#!/bin/bash

# List of CSS files
CSS_FILES="app/variables.css app/icons.css base/base.css base/links.css base/typography.css base/navigation.css base/lists.css base/buttons.css base/forms.css base/skeleton.css app/messages.css ops/web.css app/themes.css ../js/lib/jsdifflib/diffview.css"

# Output file
OUTPUT="../css/ops"

# Combine
cat $CSS_FILES > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
