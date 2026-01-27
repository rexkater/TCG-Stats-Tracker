#!/bin/bash

# Script to convert light mode classes to dark mode classes
# This script performs bulk find-and-replace operations

echo "Converting to dark mode..."

# Find all TSX files in app and components directories
FILES=$(find app components -type f -name "*.tsx")

for file in $FILES; do
  # Skip if file doesn't exist
  [ ! -f "$file" ] && continue
  
  # Create backup
  cp "$file" "$file.bak"
  
  # Replace common patterns
  sed -i 's/bg-white/bg-background-200/g' "$file"
  sed -i 's/bg-gray-50/bg-background-100/g' "$file"
  sed-i 's/bg-gray-100/bg-background-200/g' "$file"
  sed -i 's/bg-gray-200/bg-background-300/g' "$file"
  
  sed -i 's/border-gray-200/border-background-400/g' "$file"
  sed -i 's/border-gray-300/border-background-400/g' "$file"
  
  sed -i 's/text-gray-900/text-primary-900/g' "$file"
  sed -i 's/text-gray-800/text-primary-800/g' "$file"
  sed -i 's/text-gray-700/text-primary-800/g' "$file"
  sed -i 's/text-gray-600/text-primary-700/g' "$file"
  sed -i 's/text-gray-500/text-primary-600/g' "$file"
  
  sed -i 's/hover:bg-gray-50/hover:bg-background-300/g' "$file"
  sed -i 's/hover:bg-gray-100/hover:bg-background-300/g' "$file"
  sed -i 's/hover:text-gray-900/hover:text-primary-900/g' "$file"
  
  # Accent buttons
  sed -i 's/bg-accent-600/bg-accent-300/g' "$file"
  sed -i 's/hover:bg-accent-700/hover:bg-accent-400/g' "$file"
  sed -i 's/text-accent-600/text-accent-500/g' "$file"
  sed -i 's/hover:text-accent-700/hover:text-accent-600/g' "$file"
  
  # Blue links (convert to accent)
  sed -i 's/text-blue-600/text-accent-500/g' "$file"
  sed -i 's/hover:text-blue-700/hover:text-accent-600/g' "$file"
  sed -i 's/bg-blue-600/bg-secondary-300/g' "$file"
  sed -i 's/hover:bg-blue-700/hover:bg-secondary-400/g' "$file"
  sed -i 's/text-blue-100/text-secondary-800/g' "$file"
  
  echo "Processed: $file"
done

echo "Dark mode conversion complete!"
echo "Backup files created with .bak extension"
echo "Review changes and remove .bak files if satisfied"

