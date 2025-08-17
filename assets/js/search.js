let idx = null;
let store = [];

// Load search index
fetch("/search.json")
  .then(res => res.json())
  .then(data => {
    store = data;

    // Build Lunr index
    idx = lunr(function () {
      this.field("title");
      this.field("content");
      this.ref("url");

      data.forEach(doc => {
        this.add(doc);
      });
    });
  });

// Listen for search
document.getElementById("searchBox").addEventListener("input", function () {
  let query = this.value;
  let resultsBox = document.getElementById("results");
  resultsBox.innerHTML = "";

  if (query.length < 2) return; // only search if 2+ letters

  let results = idx.search(query);

  results.forEach(result => {
    let item = store.find(p => p.url === result.ref);
    if (item) {
      let li = document.createElement("li");
      li.innerHTML = `<a href="${item.url}">${item.title}</a>`;
      resultsBox.appendChild(li);
    }
  });

  if (results.length === 0) {
    resultsBox.innerHTML = "<li>No results found</li>";
  }
});
