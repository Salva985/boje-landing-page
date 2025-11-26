document.addEventListener('DOMContentLoaded', () => {
    const musicContainer = document.getElementById('music-container')
  
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          if (item.type === 'spotify') {
            const wrapper = document.createElement('div')
            wrapper.className = 'media-wrapper w-100 mb-4'
            
            const embedUrl = item.url.includes('/embed/')
              ? item.url
              : item.url.replace('/artist/', '/embed/artist/')
  
            wrapper.innerHTML = `
              <iframe style="border-radius:12px"
                src="${embedUrl}" 
                width="100%" 
                height="600"
                frameborder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
              </iframe>`
  
            musicContainer.appendChild(wrapper)
          }
        })
      })
      .catch(err => console.error('🎧 Error loading music:', err))
  })