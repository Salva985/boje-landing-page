document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('boje-live-container')

  async function loadMedia() {
    try {
      const res = await fetch('/api/media')
      const data = await res.json()

      data.forEach(item => {
        // Skip Spotify entries
        if (item.type === 'spotify') return

        const div = document.createElement('div')
        div.className = 'mb-4'

        if (item.type === 'youtube') {
          const videoId = extractYouTubeID(item.url)
          if (videoId) {
            div.innerHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
          } else {
            div.innerHTML = `<p class="text-warning">Invalid YouTube URL</p>`
          }
        } else if (item.type === 'video') {
          div.innerHTML = `<video controls class="w-100 rounded shadow"><source src="${item.url}" type="video/mp4"></video>`
        } else {
          div.innerHTML = `<p class="text-warning">Unknown type: ${item.type}</p>`
        }

        container.appendChild(div)
      })

    } catch (err) {
      console.error('❌ Error loading media:', err)
      container.innerHTML = '<p class="text-danger">Failed to load media.</p>'
    }
  }

  function extractYouTubeID(url) {
    const regex = /(?:youtube\.com.*(?:v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  loadMedia()
})