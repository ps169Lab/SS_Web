https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.jsscript>

<script>
const SHEET_URL = "YOUR_GOOGLE_SHEET_CSV_URL_HERE";

Papa.parse(SHEET_URL, {
    download: true,
    header: true,
    complete: function(results) {

        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";

        results.data.forEach(row => {

            const imageUrl = row["Image URL"];
            const caption = row["Caption"];

            if (!imageUrl) return;

            const item = document.createElement("div");
            item.className = "gallery-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${caption}">
                <p>${caption || ""}</p>
            `;

            gallery.appendChild(item);
        });
    }
});
</script>