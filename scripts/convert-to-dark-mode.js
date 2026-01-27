const fs = require('fs');
const path = require('path');

// Replacement mappings for dark mode
const replacements = [
  // Backgrounds
  { from: /\bbg-white\b/g, to: 'bg-background-200' },
  { from: /\bbg-gray-50\b/g, to: 'bg-background-100' },
  { from: /\bbg-gray-100\b/g, to: 'bg-background-200' },
  { from: /\bbg-gray-200\b/g, to: 'bg-background-300' },
  
  // Borders
  { from: /\bborder-gray-200\b/g, to: 'border-background-400' },
  { from: /\bborder-gray-300\b/g, to: 'border-background-400' },
  
  // Text colors
  { from: /\btext-gray-900\b/g, to: 'text-primary-900' },
  { from: /\btext-gray-800\b/g, to: 'text-primary-800' },
  { from: /\btext-gray-700\b/g, to: 'text-primary-800' },
  { from: /\btext-gray-600\b/g, to: 'text-primary-700' },
  { from: /\btext-gray-500\b/g, to: 'text-primary-600' },
  
  // Hover states
  { from: /\bhover:bg-gray-50\b/g, to: 'hover:bg-background-300' },
  { from: /\bhover:bg-gray-100\b/g, to: 'hover:bg-background-300' },
  { from: /\bhover:text-gray-900\b/g, to: 'hover:text-primary-900' },
  
  // Accent buttons
  { from: /\bbg-accent-600\b/g, to: 'bg-accent-300' },
  { from: /\bhover:bg-accent-700\b/g, to: 'hover:bg-accent-400' },
  { from: /\btext-accent-600\b/g, to: 'text-accent-500' },
  { from: /\bhover:text-accent-700\b/g, to: 'hover:text-accent-600' },
  
  // Blue links (convert to accent)
  { from: /\btext-blue-600\b/g, to: 'text-accent-500' },
  { from: /\bhover:text-blue-700\b/g, to: 'hover:text-accent-600' },
  { from: /\bbg-blue-600\b/g, to: 'bg-secondary-300' },
  { from: /\bhover:bg-blue-700\b/g, to: 'hover:bg-secondary-400' },
  { from: /\btext-blue-100\b/g, to: 'text-secondary-800' },
  
  // Dividers
  { from: /\bdivide-gray-200\b/g, to: 'divide-background-400' },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
console.log('🌙 Converting to dark mode...\n');

const appFiles = walkDir('app');
const componentFiles = walkDir('components');
const allFiles = [...appFiles, ...componentFiles];

let updatedCount = 0;
allFiles.forEach(file => {
  if (processFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✅ Dark mode conversion complete!`);
console.log(`📊 Updated ${updatedCount} out of ${allFiles.length} files`);

