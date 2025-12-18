// server/index.js
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import photosRoutes from './routes/photos.js'
import fileUpload from 'express-fileupload'
import contactRouter from './routes/contact.js'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3001

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Allow CORS and JSON parsing
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload())
app.use('/api/photos', photosRoutes)
app.use('/api/contact', contactRouter)

// Serve static frontend files (html, css, js, assets)
app.use(express.static(path.join(__dirname, '../public'))) // serve root folder
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')))
app.use('/css', express.static(path.join(__dirname, '..', 'css')))
app.use('/js', express.static(path.join(__dirname, '..', 'js')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Example API route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend is working! 🎉' })
})

import fs from 'fs'
const MEDIA_PATH = path.join(__dirname, 'data', 'media.json')

// Ensure the data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'))
}

// GET saved media
app.get('/api/media', (req, res) => {
  try {
    const media = fs.existsSync(MEDIA_PATH)
      ? JSON.parse(fs.readFileSync(MEDIA_PATH, 'utf-8'))
      : []
    res.json(media)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load media' })
  }
})

// POST new media
app.post('/api/media', (req, res) => {
  try {
    const newItem = req.body
    const media = fs.existsSync(MEDIA_PATH)
      ? JSON.parse(fs.readFileSync(MEDIA_PATH, 'utf-8'))
      : []
    media.push(newItem)
    fs.writeFileSync(MEDIA_PATH, JSON.stringify(media, null, 2))
    res.status(201).json({ message: 'Media saved' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save media' })
  }
})

// DELETE media by index
app.delete('/api/media/:index', (req, res) => {
    try {
      const index = parseInt(req.params.index)
  
      if (isNaN(index)) {
        return res.status(400).json({ error: 'Invalid index' })
      }
  
      const media = fs.existsSync(MEDIA_PATH)
        ? JSON.parse(fs.readFileSync(MEDIA_PATH, 'utf-8'))
        : []
  
      if (index < 0 || index >= media.length) {
        return res.status(404).json({ error: 'Item not found' })
      }
  
      media.splice(index, 1) // Remove one item at that index
      fs.writeFileSync(MEDIA_PATH, JSON.stringify(media, null, 2))
  
      res.json({ message: 'Media deleted successfully' })
    } catch (err) {
      console.error('❌ Failed to delete media:', err)
      res.status(500).json({ error: 'Failed to delete media' })
    }
  })

// Contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body
  
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }
  
    console.log('📨 New contact message received:')
    console.log({ name, email, message })
  
    res.json({ message: 'Thank you for contacting us!' })
  })


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})