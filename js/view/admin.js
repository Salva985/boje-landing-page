document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn')
    const loginSection = document.getElementById('login-section')
    const adminPanel = document.getElementById('admin-panel')
    const loginError = document.getElementById('login-error')
    const passwordInput = document.getElementById('admin-password')
  
    const mediaForm = document.getElementById('media-form')
    const previewContainer = document.getElementById('media-preview')
    const savedContainer = document.getElementById('media-saved')
    const logoutBtn = document.getElementById('logout-btn')
  
    const ADMIN_PASSWORD = 'boje2025'
    const STORAGE_KEY = 'boje_media_items'
  
    // Load saved media from localStorage
    function loadSavedMedia() {
      const mediaItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
      savedContainer.innerHTML = ''
      mediaItems.forEach((item, index) => {
        const wrapper = document.createElement('div')
        wrapper.className = 'mb-4'
        wrapper.innerHTML = `
          ${item.html}
          <button class="btn btn-sm btn-danger mt-2" data-index="${index}">Delete</button>
        `
        savedContainer.appendChild(wrapper)
      })
  
      // Attach delete buttons
      document.querySelectorAll('#media-saved button').forEach(btn => {
        btn.addEventListener('click', e => {
          const index = parseInt(e.target.dataset.index)
          deleteMedia(index)
        })
      })
    }
  
// Save to backend
async function saveMedia(html) {
  try {
    await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html })
    })
  } catch (err) {
    console.error('Error saving media:', err)
  }
}

// Load from backend
async function loadSavedMedia() {
  try {
    const res = await fetch('/api/media')
    const mediaItems = await res.json()
    savedContainer.innerHTML = ''
    mediaItems.forEach((item, index) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'mb-4'
      wrapper.innerHTML = item.html
      savedContainer.appendChild(wrapper)
    })
  } catch (err) {
    console.error('Error loading media:', err)
  }
}
  
    // Show preview only (does not save yet)
    function showPreview(html) {
      previewContainer.innerHTML = `
        ${html}
        <p class="text-muted mt-2">This is a preview only. Click "Add Media" to save it.</p>
      `
    }
  
    // LOGIN
    loginBtn.addEventListener('click', () => {
      const entered = passwordInput.value.trim()
      if (entered === ADMIN_PASSWORD) {
        loginSection.style.display = 'none'
        adminPanel.style.display = 'block'
        loadSavedMedia()
        loadBioContact() 
      } else {
        loginError.style.display = 'block'
      }
    })
  
    // FORM SUBMIT (creates and saves media)
    mediaForm.addEventListener('submit', e => {
      e.preventDefault()
      const type = document.getElementById('media-type').value
      const url = document.getElementById('media-url').value.trim()
  
      let html = ''
  
      if (type === 'spotify') {
        let embedUrl = url
        const trackMatch = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/)
        if (trackMatch && trackMatch[1] && trackMatch[2]) {
          embedUrl = `https://open.spotify.com/embed/${trackMatch[1]}/${trackMatch[2]}`
        }
        html = `<iframe style="border-radius:12px" src="${embedUrl}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
      }
  
      else if (type === 'youtube') {
        let embedUrl = url
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/)
        if (youtubeMatch && youtubeMatch[1]) {
          embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`
        }
        html = `<iframe width="100%" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`
      }
  
      else if (type === 'video') {
        html = `<video controls class="w-100 mt-3 rounded"><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`
      }
  
      showPreview(html)
      saveMedia(html)
      loadSavedMedia()
      mediaForm.reset()
    })
  
    // LOGOUT — go back to landing page
    logoutBtn.addEventListener('click', () => {
      localStorage.setItem('boje_logged_out', 'true')
      window.location.href = 'index.html'
    })

    // BIO + CONTACT KEYS
const BIO_KEY = 'boje_bio'
const CONTACT_KEY = 'boje_contact'

// Load bio and contact info on login
function loadBioContact() {
  const bio = localStorage.getItem(BIO_KEY)
  const contact = JSON.parse(localStorage.getItem(CONTACT_KEY) || '{}')

  if (bio) {
    document.getElementById('bio-text').value = bio
    document.getElementById('bio-preview').innerText = bio
  }

  if (contact.email || contact.instagram) {
    document.getElementById('contact-email').value = contact.email || ''
    document.getElementById('contact-instagram').value = contact.instagram || ''
    document.getElementById('contact-preview').innerHTML = `
      <p>Email: ${contact.email || '—'}</p>
      <p>Instagram: <a href="${contact.instagram}" target="_blank" class="text-white">${contact.instagram}</a></p>
    `
  }
}

// Save bio
document.getElementById('bio-form').addEventListener('submit', e => {
  e.preventDefault()
  const bio = document.getElementById('bio-text').value.trim()
  localStorage.setItem(BIO_KEY, bio)
  document.getElementById('bio-preview').innerText = bio
})

// Save contact info
document.getElementById('contact-form-admin').addEventListener('submit', e => {
  e.preventDefault()
  const email = document.getElementById('contact-email').value.trim()
  const instagram = document.getElementById('contact-instagram').value.trim()
  localStorage.setItem(CONTACT_KEY, JSON.stringify({ email, instagram }))
  document.getElementById('contact-preview').innerHTML = `
    <p>Email: ${email || '—'}</p>
    <p>Instagram: <a href="${instagram}" target="_blank" class="text-white">${instagram}</a></p>
  `
})
  })