document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("photo-gallery")
  
    fetch("/api/photos")
    .then(res => {
      if (!res.ok) throw new Error("API Error")
      return res.json()
    })
      .then(data => {
        data.forEach(photo => {
          const col = document.createElement("div")
          col.className = "col-md-4 mb-4"
  
          col.innerHTML = `
            <div class="card bg-secondary">
              <img src="${photo.url}" class="card-img-top" alt="BOJE Photo">
            </div>
          `
  
          gallery.appendChild(col)
        })
      })
      .catch(err => {
        console.error("❌ Error loading photos:", err)
      })
  })