#!/bin/bash

# List of CSS files
CSS_FILES="app/variables.css base/base.css base/typography.css base/buttons.css base/forms.css konnun/web.css konnun/tablet.css konnun/mobile.css themes/default.css"

# Output file
OUTPUT="../css/konnun.css"

# Combine
cat $CSS_FILES > $OUTPUT

echo "✅ CSS files combined into $OUTPUT"
