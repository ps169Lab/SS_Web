/*
  unit-content-loader.js
  ------------------------------------------------------------------
  Shared by every page in a unit. Each page sets a PAGE_KEY constant
  BEFORE including this script, e.g.:

      <script>const PAGE_KEY = "geography";</script>
      <script src="../unit-content-loader.js"></script>

  Requires PapaParse (loaded via CDN) to be present on the page.

  HOW IT WORKS
  ------------------------------------------------------------------
  1. Fetches a published Google Sheet tab as CSV.
  2. Filters rows down to the ones matching this page's PAGE_KEY.
  3. Fills in placeholder elements based on each row's "type":

       text       -> element with matching data-key (and data-level,
                     if present) gets its innerHTML set
       image      -> <img data-key="..."> gets its src (and alt) set
       list-item  -> appends an <li> into [data-key="KEY-list"]
       dl-item    -> appends a <dt>/<dd> pair into [data-key="KEY-list"],
                     content column format: "Term|Definition"
       table-row  -> appends a <tr> of <td>s into [data-key="KEY-body"],
                     content column format: "cell1|cell2|cell3"

  Your existing reading-level toggle script and Google Translate
  widget don't need to change at all -- they just operate on the
  DOM after this script has populated it.
*/

(function () {
  // TODO: paste your published Google Sheet CSV export link here.
  // File > Share > Publish to web > select the correct tab > CSV
  // Looks like: https://docs.google.com/spreadsheets/d/e/LONG_ID/pub?gid=123456&single=true&output=csv
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1enlB2WceVmmctyzgOj4kkospKYNG0ljo2o1fReVezeU/edit?usp=sharing";

  if (typeof PAGE_KEY === "undefined" || !PAGE_KEY) {
    console.error("unit-content-loader.js: PAGE_KEY is not set on this page.");
    return;
  }

  fetch(SHEET_CSV_URL)
    .then((res) => res.text())
    .then((csv) => {
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
      const rows = parsed.data
        .filter((r) => (r.page || "").trim() === PAGE_KEY)
        .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
      rows.forEach(renderRow);
    })
    .catch((err) => console.error("unit-content-loader.js: failed to load sheet content", err));

  function renderRow(row) {
    switch ((row.type || "").trim()) {
      case "text":
        renderText(row);
        break;
      case "image":
        renderImage(row);
        break;
      case "list-item":
        renderListItem(row);
        break;
      case "dl-item":
        renderDlItem(row);
        break;
      case "table-row":
        renderTableRow(row);
        break;
      default:
        console.warn("unit-content-loader.js: unknown type in sheet row", row);
    }
  }

  function findTextElement(row) {
    const key = row.key;
    const level = (row.level || "").trim();
    if (level) {
      return document.querySelector(`[data-key="${key}"][data-level="${level}"]`);
    }
    return document.querySelector(`[data-key="${key}"]`);
  }

  function renderText(row) {
    const el = findTextElement(row);
    if (el) el.innerHTML = row.content || "";
  }

  function renderImage(row) {
    const el = document.querySelector(`[data-key="${row.key}"]`);
    if (!el) return;
    el.src = row.content || "";
    if (row.alt) el.alt = row.alt;
  }

  function renderListItem(row) {
    const container = document.querySelector(`[data-key="${row.key}-list"]`);
    if (!container) return;
    const li = document.createElement("li");
    li.innerHTML = row.content || "";
    container.appendChild(li);
  }

  function renderDlItem(row) {
    const container = document.querySelector(`[data-key="${row.key}-list"]`);
    if (!container) return;
    const [term, def] = (row.content || "").split("|").map((s) => s.trim());
    const dt = document.createElement("dt");
    dt.textContent = term || "";
    const dd = document.createElement("dd");
    dd.textContent = def || "";
    container.appendChild(dt);
    container.appendChild(dd);
  }

  function renderTableRow(row) {
    const container = document.querySelector(`[data-key="${row.key}-body"]`);
    if (!container) return;
    const cells = (row.content || "").split("|").map((s) => s.trim());
    const tr = document.createElement("tr");
    cells.forEach((cellText) => {
      const td = document.createElement("td");
      td.innerHTML = cellText;
      tr.appendChild(td);
    });
    container.appendChild(tr);
  }
})();
