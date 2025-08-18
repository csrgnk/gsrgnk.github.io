// -----------------------------
// ADMIN PANEL SCRIPT
// -----------------------------

// Fetch JSON files
let posts = [];
let pages = [];
let subscribers = [];
let siteSettings = {};

// Utility: fetch JSON
async function fetchJSON(url) {
    const res = await fetch(url);
    return await res.json();
}

// Utility: download JSON
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

// -----------------------------
// INIT
// -----------------------------
async function initAdmin() {
    posts = await fetchJSON('/posts.json');
    pages = await fetchJSON('/pages.json');
    subscribers = await fetchJSON('/subscribers.json');
    siteSettings = await fetchJSON('/site-settings.json');
    renderPosts();
    renderPages();
    renderSubscribers();
}

initAdmin();

// -----------------------------
// POSTS MANAGEMENT
// -----------------------------
function renderPosts() {
    const postsList = document.getElementById('postsList');
    postsList.innerHTML = '';
    posts.forEach((post, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <b>${post.title}</b> - <i>${post.category}</i>
            <button onclick="editPost(${index})">Edit</button>
            <button onclick="deletePost(${index})">Delete</button>
        `;
        postsList.appendChild(div);
    });
}

document.getElementById('addPostBtn').onclick = () => {
    const title = document.getElementById('postTitle').value.trim();
    const slug = document.getElementById('postSlug').value.trim();
    const category = document.getElementById('postCategory').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const metaDescription = document.getElementById('metaDescription').value.trim();
    const focusKeyword = document.getElementById('focusKeyword').value.trim();
    const metaKeywords = document.getElementById('metaKeywords').value.trim();
    const youtubeUrl = document.getElementById('youtubeUrl').value.trim();

    if(!title || !slug) { alert('Title and Slug required'); return; }

    const post = {
        title,
        slug,
        url: `/posts/${slug}/`,
        category,
        createdAt: new Date().toISOString(),
        metaDescription,
        focusKeyword,
        metaKeywords,
        youtubeUrl,
        youtubeEmbed: '',
        thumbnail: ''
    };

    posts.push(post);
    downloadJSON(posts, 'posts.json');
    renderPosts();
    alert('Post added! Please commit the updated posts.json and generate HTML.');
}

// Placeholder functions for edit/delete
function editPost(index){ alert('Edit post not implemented in this example'); }
function deletePost(index){ 
    if(confirm('Delete this post?')){
        posts.splice(index,1);
        downloadJSON(posts,'posts.json');
        renderPosts();
    }
}

// -----------------------------
// PAGES MANAGEMENT
// -----------------------------
function renderPages() {
    const tbody = document.querySelector('#pagesTable tbody');
    tbody.innerHTML = '';
    pages.forEach((page,index)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${page.title}</td>
            <td>${page.url}</td>
            <td>
                <button onclick="editPage(${index})">Edit</button>
                <button onclick="deletePage(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('addPageBtn').onclick = ()=>{
    const title = document.getElementById('pageTitle').value.trim();
    const slug = document.getElementById('pageSlug').value.trim();
    const content = document.getElementById('pageContent').value.trim();
    if(!title || !slug){ alert('Title & Slug required'); return; }

    const page = {
        title,
        slug,
        url:`/pages/${slug}/`,
        content,
        createdAt:new Date().toISOString()
    };
    pages.push(page);
    downloadJSON(pages,'pages.json');
    renderPages();
    alert('Page added! Commit pages.json and create index.html.');
}

function editPage(index){ alert('Edit page not implemented in this example'); }
function deletePage(index){
    if(confirm('Delete this page?')){
        pages.splice(index,1);
        downloadJSON(pages,'pages.json');
        renderPages();
    }
}

// -----------------------------
// SUBSCRIBERS MANAGEMENT
// -----------------------------
function renderSubscribers(){
    const tbody = document.querySelector('#subscriberTable tbody');
    tbody.innerHTML = '';
    subscribers.forEach((sub,index)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${sub.name}</td><td>${sub.email}</td><td>${sub.subscribedAt}</td>
        <td><button onclick="deleteSubscriber(${index})">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}

document.getElementById('addSubscriberBtn').onclick = ()=>{
    const name = document.getElementById('subscriberName').value.trim();
    const email = document.getElementById('subscriberEmail').value.trim();
    if(!name || !email){ alert('Name & Email required'); return; }
    const sub = { name,email,subscribedAt:new Date().toISOString() };
    subscribers.push(sub);
    downloadJSON(subscribers,'subscribers.json');
    renderSubscribers();
}

// Delete subscriber
function deleteSubscriber(index){
    if(confirm('Delete this subscriber?')){
        subscribers.splice(index,1);
        downloadJSON(subscribers,'subscribers.json');
        renderSubscribers();
    }
}

// -----------------------------
// Sitemap & Robots
// -----------------------------
document.getElementById('generateSitemapBtn').onclick = ()=>{
    let urls = [];
    posts.forEach(p=>urls.push({loc:`https://dasabodha.omnnbc.in${p.url}`, lastmod:p.createdAt}));
    pages.forEach(p=>urls.push({loc:`https://dasabodha.omnnbc.in${p.url}`, lastmod:p.createdAt}));
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urls.forEach(u=>{
        sitemap += `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
    sitemap += `</urlset>`;
    const blob = new Blob([sitemap],{type:'application/xml'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    a.click();
}

document.getElementById('generateRobotsBtn').onclick = ()=>{
    const robots = `User-agent: *\nDisallow: /admin-panel.html\nDisallow: /login.html\nDisallow: /scripts/\nDisallow: /users.json\nDisallow: /subscribers.json\nAllow: /\n\nSitemap: https://dasabodha.omnnbc.in/sitemap.xml`;
    document.getElementById('robotsPreview').textContent = robots;
    const blob = new Blob([robots],{type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download='robots.txt';
    a.click();
}
