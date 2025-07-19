#!/bin/bash

# List of CSS files
css_files=(
	"css_mixins/app/variables.css" 
	"css_mixins/base/base.css" 
	"css_mixins/base/images.css" 
	"css_mixins/base/tables.css" 
	"css_mixins/base/links.css"
	"css_mixins/base/typography.css"
	"css_mixins/base/buttons.css"
	"css_mixins/base/forms.css"
	"css_mixins/base/skeleton.css"
	"css_mixins/app/messages.css"
	"css_mixins/app/django-forms.css"

	"css_mixins/reports/breadcrumbs.css"
	"css_mixins/reports/graphs.css"
	"css_mixins/reports/lightbox.css"
	"css_mixins/reports/pdf-builder.css"
	"css_mixins/reports/tables.css"
	"css_mixins/reports/dashboard.css"
	"css_mixins/reports/styles.css"
	"css_mixins/reports/all_lines.css"

	"css_mixins/app/themes.css"
)


# Output file
OUTPUT="css/reports"

# Combine
cat "${css_files[@]}" > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
