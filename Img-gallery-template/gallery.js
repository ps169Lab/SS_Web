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

  imgData.tags.forEach(tag => {
    const pill = document.createElement('span');
    pill.className = 'tag' + (activeFilters.has(tag) ? ' tag-active' : '');

    const label = document.createElement('span');
    label.className = 'tag-label';
    label.textContent = tag;
    label.addEventListener('click', () => addFilter(tag));

    const removeBtn = document.createElement('button');
    removeBtn.className = 'tag-remove';
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove tag';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeTag(imgData, tag);
    });

    pill.appendChild(label);
    pill.appendChild(removeBtn);
    tagsEl.appendChild(pill);
  });

  // + button
  const addBtn = document.createElement('button');
  addBtn.className = 'tag-add-btn';
  addBtn.textContent = '+';
  addBtn.title = 'Add tag';

  const input = document.createElement('input');
  input.className = 'tag-add-input';
  input.type = 'text';
  input.placeholder = 'new tag...';
  input.style.display = 'none';

  function openInput() {
    addBtn.style.display = 'none';
    input.style.display = 'inline-block';
    input.focus();
  }

  function closeInput() {
    input.value = '';
    input.style.display = 'none';
    addBtn.style.display = 'inline-block';
  }

  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openInput();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveTag(imgData, input.value);
    } else if (e.key === 'Escape') {
      closeInput();
    }
    e.stopPropagation();
  });

  input.addEventListener('blur', () => closeInput());
  input.addEventListener('click', (e) => e.stopPropagation());

  tagsEl.appendChild(addBtn);
  tagsEl.appendChild(input);

  return tagsEl;
}

function renderGallery() {
  gallery.innerHTML = '';

  const typedQuery = searchInput.value.trim().toLowerCase();

  const filtered = images.filter(img => {
    const matchesActive = activeFilters.size === 0 || [...activeFilters].every(f => img.tags.includes(f));
    const matchesTyped = !typedQuery || img.tags.some(t => t.toLowerCase().includes(typedQuery));
    return matchesActive && matchesTyped;
  });

  noResults.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach(imgData => {
    const item = document.createElement('div');
    item.className = 'image-item';

    const img = document.createElement('img');
    img.src = imgData.url;
    img.alt = imgData.tags.join(', ');
    img.loading = 'lazy';

    item.appendChild(img);
    item.appendChild(buildTagsEl(imgData));
    gallery.appendChild(item);
  });
}

// Export updated images.js
document.getElementById('export-btn').addEventListener('click', () => {
  const content = `const images = ${JSON.stringify(images, null, 2)};\n`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'images.js';
  a.click();
  URL.revokeObjectURL(a.href);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addFilter(searchInput.value);
  } else if (e.key === 'Backspace' && searchInput.value === '' && activeFilters.size > 0) {
    // remove last active filter on backspace when input is empty
    const last = [...activeFilters].pop();
    activeFilters.delete(last);
    renderActivePills();
    renderGallery();
  }
});

searchInput.addEventListener('input', () => renderGallery());

renderGallery();
