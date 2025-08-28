#!/bin/bash

# List of CSS files
css_files=(
	"css_mixins/app/variables.css" 
	"css_mixins/app/fonts.css" 
	"css_mixins/base/base.css"
	"css_mixins/base/skeleton.css"
	"css_mixins/base/typography.css"
	"css_mixins/base/tables.css"
	"css_mixins/reports/tables.css"
	"css_mixins/pdfs/style.css"

)

# Output file
OUTPUT="css/pdfs"

# Combine
cat "${css_files[@]}" > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
