#!/bin/bash

# List of CSS files
css_files=(
	"css_mixins/app/variables.css" 
	"css_mixins/app/django-forms.css" 
	"css_mixins/base/buttons.css"
	"css_mixins/crm/style.css"
	"css_mixins/app/themes.css"
)


# Output file
OUTPUT="css/crm"

# Combine
cat "${css_files[@]}" > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
