document.addEventListener('DOMContentLoaded', () => {
  const password = 'boje2025'

  const loginSection = document.getElementById('login-section')
  const adminPanel = document.getElementById('admin-panel')
  const loginBtn = document.getElementById('login-btn')
  const logoutBtn = document.getElementById('logout-btn')
  const loginError = document.getElementById('login-error')

  const mediaForm = document.getElementById('media-form')
  const mediaType = document.getElementById('media-type')
  const mediaURL = document.getElementById('media-url')
  const mediaPreview = document.getElementById('media-preview')
  const mediaSaved = document.getElementById('media-saved')

  // 🔐 LOGIN
  loginBtn.addEventListener('click', () => {
    const input = document.getElementById('admin-password').value
    if (input === password) {
      loginSection.style.display = 'none'
      adminPanel.style.display = 'block'
      loginError.style.display = 'none'
      loadSavedMedia()
    } else {
      loginError.style.display = 'block'
    }
  })

  logoutBtn.addEventListener('click', () => {
    loginSection.style.display = 'block'
    adminPanel.style.display = 'none'
  })

  // 📤 ADD NEW MEDIA
  mediaForm.addEventListener('submit', (e) => {
    e.preventDefault()
  
    const type = mediaType.value
    const url = mediaURL.value.trim()
    let isValid = false
    let previewHTML = ''
  
    if (!type || !url) {
      showInlineAlert('Please fill in all fields.')
      return
    }
  
    // Generate preview & validate
    if (type === 'spotify') {
      const embedUrl = convertSpotifyToEmbed(url)
      if (embedUrl) {
        previewHTML = `<iframe style="border-radius:12px" src="${embedUrl}" width="100%" height="152" frameborder="0" allow="encrypted-media"></iframe>`
        isValid = true
      }
    } else if (type === 'youtube') {
      const id = extractYouTubeID(url)
      if (id) {
        previewHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0"></iframe>`
        isValid = true
      }
    } else if (type === 'video') {
      if (url.endsWith('.mp4')) {
        previewHTML = `<video controls class="w-100 rounded"><source src="${url}" type="video/mp4"></video>`
        isValid = true
      }
    }
  
    if (!isValid) {
      showInlineAlert("❌ Invalid URL. Please paste a correct Spotify, YouTube or .mp4 link.")
      mediaPreview.innerHTML = '' // clear previous preview if any
      return
    }
  
    // Hide alert if passed
    hideInlineAlert()
  
    // Show preview
    mediaPreview.innerHTML = ''
    const preview = document.createElement('div')
    preview.className = 'mb-3'
    preview.innerHTML = previewHTML
    mediaPreview.appendChild(preview)
  
    // Save to backend
    fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, url })
    })
      .then(res => res.json())
      .then(() => {
        mediaForm.reset()
        mediaPreview.innerHTML = ''
        loadSavedMedia()
      })
      .catch(err => {
        console.error('❌ Error saving media:', err)
        alert('There was a problem saving the media.')
      })
  })

  // 📥 LOAD SAVED MEDIA
  function loadSavedMedia() {
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        mediaSaved.innerHTML = ''
        data.forEach((item, index) => {
          const wrapper = document.createElement('div')
          wrapper.className = 'mb-4 p-3 bg-dark rounded border position-relative'

          let html = ''
          if (item.type === 'spotify') {
            const embedUrl = convertSpotifyToEmbed(item.url)
            html = embedUrl
              ? `<iframe style="border-radius:12px" src="${embedUrl}" width="100%" height="152" frameborder="0" allow="encrypted-media"></iframe>`
              : `<p class="text-warning">Invalid Spotify URL</p>`
          } else if (item.type === 'youtube') {
            const id = extractYouTubeID(item.url)
            html = id
              ? `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0"></iframe>`
              : `<p class="text-warning">Invalid YouTube URL</p>`
          } else if (item.type === 'video') {
            html = `<video controls class="w-100 rounded shadow"><source src="${item.url}" type="video/mp4"></video>`
          }

          wrapper.innerHTML = html

          // 🗑️ DELETE BUTTON
          const del = document.createElement('button')
          del.textContent = 'Delete'
          del.className = 'btn btn-danger btn-sm mt-2'
          del.addEventListener('click', () => {
            if (confirm('Delete this media?')) {
              deleteMedia(index)
            }
          })

          wrapper.appendChild(del)
          mediaSaved.appendChild(wrapper)
        })
      })
  }

  // 🗑️ DELETE FUNCTION
  function deleteMedia(index) {
    fetch(`/api/media/${index}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => loadSavedMedia())
      .catch(err => {
        console.error('❌ Error deleting media:', err)
        alert('Failed to delete item.')
      })
  }

  // 🎥 Extract YouTube ID
  function extractYouTubeID(url) {
    const regex = /(?:youtube\.com.*(?:v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  function convertSpotifyToEmbed(url) {
    try {
      const cleanUrl = url.split('?')[0]
  
      const regex = /https?:\/\/open\.spotify\.com\/(track|album|artist|playlist)\/([a-zA-Z0-9]+)/
      const match = cleanUrl.match(regex)
  
      if (!match) return null
  
      const [, type, id] = match
      return `https://open.spotify.com/embed/${type}/${id}`
    } catch (e) {
      console.error('Spotify embed error:', e)
      return null
    }
  }

  function showInlineAlert(message) {
    const alertBox = document.getElementById('invalid-url-alert')
    alertBox.textContent = message
    alertBox.classList.remove('d-none')
  
    setTimeout(() => {
      alertBox.classList.add('d-none')
    }, 4000)
  }

  function hideInlineAlert() {
    const alertBox = document.getElementById('invalid-url-alert')
    if (alertBox) {
      alertBox.classList.add('d-none')
      alertBox.textContent = ''
    }
  }
})