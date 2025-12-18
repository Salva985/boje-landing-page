document.addEventListener("DOMContentLoaded", () => {
  // 1. Contact Form Logic
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const name = document.getElementById("name").value.trim()
      const email = document.getElementById("email").value.trim()
      const message = document.getElementById("message").value.trim()

      if (!name || !email || !message) {
        alert("Please fill in all fields")
        return
      }

      fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message })
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Message sent")
          contactForm.reset()
        })
        .catch(err => {
          console.error("Failed to send message", err)
          alert("There was a problem sending your message")
        })
    })
  }

  // 2. Media Gallery Logic
  const mediaGallery = document.getElementById("boje-live-container");
  if (!mediaGallery) return;

  const mediaItems = [
    {
      type: "youtube",
      embed: `<iframe src="https://www.youtube.com/embed/Wb7sm0iWEiA" frameborder="0" allowfullscreen></iframe>`,
    },
    {
      type: "spotify",
      embed: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUsuxWHRQd?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
    },
    {
      type: "local",
      embed: `<video controls width="100%">
                <source src="/media/myvideo.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>`,
    },
  ];

  mediaItems.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const wrapper = document.createElement("div")
    wrapper.className = "ratio ratio-16x9 rounded shadow-sm overflow-hidden"
    wrapper.innerHTML = item.embed

    col.appendChild(card);
    mediaGallery.appendChild(col);
  });
})