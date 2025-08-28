#!/bin/bash

# List of CSS files
css_files=(
	"css_mixins/app/variables.css" 
	"css_mixins/app/fonts.css" 
	"css_mixins/app/icons.css"
	"css_mixins/base/base.css" 
	"css_mixins/base/links.css"
	"css_mixins/base/typography.css"
	"css_mixins/base/navigation.css"
	"css_mixins/base/lists.css"
	"css_mixins/base/buttons.css"
	"css_mixins/base/forms.css"
	"css_mixins/base/skeleton.css"
	"css_mixins/app/messages.css"
	"css_mixins/ops/web.css"
	"css_mixins/app/themes.css"
	"js/lib/jsdifflib/diffview.css"
)


# Output file
OUTPUT="css/ops"

# Combine
cat "${css_files[@]}" > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
