#!/bin/bash

# List of CSS files
css_files=(
	"css_mixins/charts/style.css" 
)


# Output file
OUTPUT="css/charts"

# Combine
cat "${css_files[@]}" > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
