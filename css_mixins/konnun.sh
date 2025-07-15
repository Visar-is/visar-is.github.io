#!/bin/bash

# List of CSS files
CSS_FILES="app/variables.css base/base.css base/typography.css base/buttons.css base/forms.css konnun/web.css konnun/tablet.css konnun/mobile.css app/themes.css"

# Output file
OUTPUT="../css/konnun"

# Combine
cat $CSS_FILES > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
