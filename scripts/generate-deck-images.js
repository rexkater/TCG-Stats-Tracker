const fs = require('fs');
const path = require('path');

// Riftbound legends with their associated colors
const legends = [
  { name: 'Ahri', color: '#E91E63' },        // Pink/Magenta
  { name: 'Annie', color: '#FF5722' },       // Deep Orange
  { name: 'Darius', color: '#9C27B0' },      // Purple
  { name: 'Garen', color: '#2196F3' },       // Blue
  { name: 'Jinx', color: '#FF1744' },        // Red
  { name: "Kai'Sa", color: '#9C27B0' },      // Purple
  { name: 'Lee Sin', color: '#FF9800' },     // Orange
  { name: 'Leona', color: '#FFC107' },       // Amber/Gold
  { name: 'Lux', color: '#FFEB3B' },         // Yellow
  { name: 'Master Yi', color: '#00BCD4' },   // Cyan
  { name: 'Miss Fortune', color: '#F44336' }, // Red
  { name: 'Sett', color: '#FF6F00' },        // Dark Orange
  { name: 'Teemo', color: '#4CAF50' },       // Green
  { name: 'Viktor', color: '#607D8B' },      // Blue Grey
  { name: 'Volibear', color: '#3F51B5' },    // Indigo
  { name: 'Yasuo', color: '#00BCD4' },       // Cyan
];

// Create SVG for each legend
legends.forEach(legend => {
  const initial = legend.name[0];
  const fileName = legend.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-');
  
  const svg = `<svg width="200" height="280" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="grad-${fileName}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${legend.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(legend.color, -30)};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Card background -->
  <rect width="200" height="280" rx="12" fill="url(#grad-${fileName})"/>
  
  <!-- Border -->
  <rect x="4" y="4" width="192" height="272" rx="10" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  
  <!-- Initial circle -->
  <circle cx="100" cy="140" r="60" fill="rgba(255,255,255,0.2)" filter="url(#shadow)"/>
  
  <!-- Initial letter -->
  <text x="100" y="165" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
        fill="white" text-anchor="middle" filter="url(#shadow)">${initial}</text>
  
  <!-- Legend name -->
  <rect x="10" y="230" width="180" height="40" rx="6" fill="rgba(0,0,0,0.4)"/>
  <text x="100" y="257" font-family="Arial, sans-serif" font-size="20" font-weight="600" 
        fill="white" text-anchor="middle">${legend.name}</text>
</svg>`;

  const outputPath = path.join(__dirname, '..', 'public', 'decks', `${fileName}.svg`);
  fs.writeFileSync(outputPath, svg);
  console.log(`✅ Created ${fileName}.svg`);
});

console.log(`\n🎉 Generated ${legends.length} deck images!`);

// Helper function to adjust color brightness
function adjustBrightness(hex, percent) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  r = Math.max(0, Math.min(255, r + (r * percent / 100)));
  g = Math.max(0, Math.min(255, g + (g * percent / 100)));
  b = Math.max(0, Math.min(255, b + (b * percent / 100)));
  
  // Convert back to hex
  const rr = Math.round(r).toString(16).padStart(2, '0');
  const gg = Math.round(g).toString(16).padStart(2, '0');
  const bb = Math.round(b).toString(16).padStart(2, '0');
  
  return `#${rr}${gg}${bb}`;
}

