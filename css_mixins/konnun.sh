#!/bin/bash

# List of CSS files
css_files=(
	"css_mixins/app/variables.css" 
	"css_mixins/app/fonts.css" 
	"css_mixins/base/base.css" 
	"css_mixins/base/typography.css"
	"css_mixins/base/buttons.css"
	"css_mixins/base/forms.css"
	"css_mixins/base/links.css"
	"css_mixins/app/messages.css"
	"css_mixins/konnun/web.css"
	"css_mixins/konnun/tablet.css"
	"css_mixins/konnun/mobile.css"
	"css_mixins/app/themes.css"
)


# Output file
OUTPUT="css/konnun"

# Combine
cat "${css_files[@]}" > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
