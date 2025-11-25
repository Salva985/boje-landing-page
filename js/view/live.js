document.addEventListener('DOMContentLoaded', () => {
    const liveContainer = document.getElementById('boje-live-container')
  
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) {
          liveContainer.innerHTML = `<p class="text-muted">No media available yet.</p>`
          return
        }
  
        data.forEach(item => {
          const div = document.createElement('div')
          div.className = 'mb-4'
          div.innerHTML =item.html
          liveContainer.appendChild(div)
        })
      })
      .catch(error => {
        console.error("Error loading media:", error)
        liveContainer.innerHTML = `<p class="text-danger">Failed to load media.</p>`
      })
  })