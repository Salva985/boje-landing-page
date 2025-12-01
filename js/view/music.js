document.addEventListener('DOMContentLoaded', () => {
    const musicContainer = document.getElementById('music-container');
  
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          if (item.type === 'spotify') {
            const embedUrl = convertSpotifyToEmbed(item.url);
            if (!embedUrl) return; // skip invalid links
  
            const wrapper = document.createElement('div');
            wrapper.className = 'media-wrapper w-100 mb-4';
  
            wrapper.innerHTML = `
              <iframe style="border-radius:12px"
                src="${embedUrl}" 
                width="100%" 
                height="152"
                frameborder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
              </iframe>`;
  
            musicContainer.appendChild(wrapper);
          }
        });
      })
      .catch(err => console.error('🎧 Error loading music:', err));
  
    function convertSpotifyToEmbed(url) {
      try {
        const cleanUrl = url.split('?')[0];
        const regex = /https?:\/\/open\.spotify\.com\/(track|album|artist|playlist)\/([a-zA-Z0-9]+)/;
        const match = cleanUrl.match(regex);
        if (!match) return null;
        const [, type, id] = match;
        return `https://open.spotify.com/embed/${type}/${id}`;
      } catch (e) {
        return null;
      }
    }
  });