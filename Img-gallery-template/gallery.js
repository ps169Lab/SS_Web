const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');
const activePillsEl = document.getElementById('active-pills');

let activeFilters = new Set();

function renderActivePills() {
  activePillsEl.innerHTML = '';
  activeFilters.forEach(tag => {
    const pill = document.createElement('span');
    pill.className = 'active-pill';

    const label = document.createElement('span');
    label.textContent = tag;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      activeFilters.delete(tag);
      renderActivePills();
      renderGallery();
    });

    pill.appendChild(label);
    pill.appendChild(removeBtn);
    activePillsEl.appendChild(pill);
  });
}

function addFilter(tag) {
  const t = tag.trim().toLowerCase();
  if (t) {
    activeFilters.add(t);
    searchInput.value = '';
    renderActivePills();
    renderGallery();
  }
}

function saveTag(imgData, newTag) {
  const tag = newTag.trim().toLowerCase();
  if (tag && !imgData.tags.includes(tag)) {
    imgData.tags.push(tag);
    renderGallery();
  }
}

function removeTag(imgData, tag) {
  imgData.tags = imgData.tags.filter(t => t !== tag);
  renderGallery();
}

function buildTagsEl(imgData) {
  const tagsEl = document.createElement('div');
  tagsEl.className = 'image-tags';
  return tagsEl;
}

function renderGallery() {
  gallery.innerHTML = '';

  noResults.style.display = 'none';

  images.forEach(imgData => {
    const item = document.createElement('div');
    item.className = 'image-item';

    const img = document.createElement('img');
    img.src = imgData.url;
    img.loading = 'lazy';

    item.appendChild(img);
    item.appendChild(buildTagsEl(imgData));
    gallery.appendChild(item);
  });
}

// Export updated images.js
// document.getElementById('export-btn').addEventListener('click', () => {
//   const content = `const images = ${JSON.stringify(images, null, 2)};\n`;
//   const blob = new Blob([content], { type: 'text/javascript' });
//   const a = document.createElement('a');
//   a.href = URL.createObjectURL(blob);
//   a.download = 'images.js';
//   a.click();
//   URL.revokeObjectURL(a.href);
// });

// searchInput.addEventListener('keydown', (e) => {
//   if (e.key === 'Enter') {
//     e.preventDefault();
//   }
// });

// searchInput.addEventListener('input', () => {});

renderGallery();
