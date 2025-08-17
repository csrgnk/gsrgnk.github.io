const fs = require('fs');
const path = require('path');

// Folder where your posts are stored
const postsDir = path.join(__dirname, 'posts');

// Array to hold all posts
let posts = [];

// Read all files in posts folder
fs.readdirSync(postsDir).forEach(file => {
  if (file.endsWith('.html')) {
    const title = file.replace('.html', '').replace(/-/g, ' ');
    const url = `/posts/${file}`;
    posts.push({ title, url });
  }
});

// Write to posts.json
fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));

console.log('posts.json generated successfully!');
