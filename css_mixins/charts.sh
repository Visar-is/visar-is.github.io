#!/bin/bash

# List of CSS files
css_files=(
	"css_mixins/charts/style.css" 
	"css_mixins/charts/bars.css" 
	"css_mixins/charts/h_bar.css" 
	"css_mixins/charts/is_muni_map.css" 
	"css_mixins/charts/line.css" 
	"css_mixins/charts/scatter.css" 

	"css_mixins/charts/overrides.css" 

)


# Output file
OUTPUT="css/charts"

# Combine
cat "${css_files[@]}" > "${OUTPUT}.css"

echo "✅ CSS files combined into ${OUTPUT}.css"

uglifycss "${OUTPUT}.css" > "${OUTPUT}.min.css"
