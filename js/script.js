document.addEventListener('DOMContentLoaded', () => {
    // 1. Contact Form Logic
    const contactForm = document.getElementById('contact-form');
  
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
  
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }
  
      // Simulate sending message
      alert(`Thanks ${name}, your message has been sent!`);
      contactForm.reset();
    });
  
    // 2. Dynamically Load Media Content
    const mediaGallery = document.getElementById('media-gallery');
  
    const mediaItems = [
      {
        type: 'spotify',
        embed: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/6H5GRoWj00kN40WG1dV2vW?utm_source=generator" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
      },
      {
        type: 'video',
        src: 'assets/video/boje-live.mp4'
      },
      {
        type: 'youtube',
        embed: `<iframe width="100%" height="315" src="https://www.youtube.com/embed/_YOUR_VIDEO_ID_" frameborder="0" allowfullscreen></iframe>`
      }
    ];
  
    mediaItems.forEach(item => {
      const col = document.createElement('div');
      col.className = 'col-md-6 mb-4';
  
      if (item.type === 'spotify' || item.type === 'youtube') {
        col.innerHTML = item.embed;
      } else if (item.type === 'video') {
        col.innerHTML = `
          <video controls class="w-100 rounded shadow">
            <source src="${item.src}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      }
  
      mediaGallery.appendChild(col);
    });
  });