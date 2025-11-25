// server/index.js
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3001

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Allow CORS and JSON parsing
app.use(cors())
app.use(express.json())

// ✅ Serve static frontend files (html, css, js, assets)
app.use(express.static(path.join(__dirname, '..'))) // serve root folder
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')))
app.use('/css', express.static(path.join(__dirname, '..', 'css')))
app.use('/js', express.static(path.join(__dirname, '..', 'js')))

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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})