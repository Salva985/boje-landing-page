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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})