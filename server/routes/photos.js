import express from 'express'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()

const __dirname = dirname(fileURLToPath(import.meta.url))
const PHOTOS_FOLDER = join(__dirname, '../uploads/photos')
const PHOTOS_JSON = join(__dirname, '../data/photos.json')

// Make sure folders exist
if (!fs.existsSync(PHOTOS_FOLDER)) {
  fs.mkdirSync(PHOTOS_FOLDER, { recursive: true })
}

router.get('/', (req, res) => {
  const photos = fs.existsSync(PHOTOS_JSON)
    ? JSON.parse(fs.readFileSync(PHOTOS_JSON))
    : []

  res.json(photos)
})

router.post('/', (req, res) => {
  // 🔥 CHECK FILE
  if (!req.files || !req.files.photo) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const photo = req.files.photo
  const fileName = `photo-${Date.now()}.JPG`
  const savePath = join(PHOTOS_FOLDER, fileName)

  photo.mv(savePath, err => {
    if (err) {
      console.error('Upload error:', err)
      return res.status(500).json({ error: 'Failed to save photo' })
    }

    // Save metadata
    let data = []
    if (fs.existsSync(PHOTOS_JSON)) {
      data = JSON.parse(fs.readFileSync(PHOTOS_JSON))
    }

    const photoUrl = `/uploads/photos/${fileName}`
    data.push({ url: photoUrl })
    fs.writeFileSync(PHOTOS_JSON, JSON.stringify(data, null, 2))

    res.status(201).json({ message: 'Photo uploaded', url: photoUrl })
  })
})

router.delete('/:index', (req, res) => {
  const index = parseInt(req.params.index)
  if (isNaN(index)) return res.status(400).json({ error: 'Invalid index' })

  let data = []
  if (fs.existsSync(PHOTOS_JSON)) {
    data = JSON.parse(fs.readFileSync(PHOTOS_JSON))
  }

  if (index < 0 || index >= data.length) {
    return res.status(404).json({ error: 'Photo not found' })
  }

  const removed = data.splice(index, 1)[0]
  const filePath = join(__dirname, '../../', removed.url)

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  fs.writeFileSync(PHOTOS_JSON, JSON.stringify(data, null, 2))
  res.json({ message: 'Photo deleted' })
})

export default router