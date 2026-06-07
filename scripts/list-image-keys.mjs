// Prints every expected 60-gapja image filename (romanization-based).
// Usage: node scripts/list-image-keys.mjs

const STEMS = ['gap', 'eul', 'byeong', 'jeong', 'mu', 'gi', 'gyeong', 'sin', 'im', 'gye'];
const BRANCHES = ['ja', 'chuk', 'in', 'myo', 'jin', 'sa', 'o', 'mi', 'sin', 'yu', 'sul', 'hae'];

for (let i = 0; i < 60; i++) {
  console.log(`${STEMS[i % 10]}${BRANCHES[i % 12]}.png`);
}
