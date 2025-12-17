import express from 'express'
import multer from 'multer'
import fs from 'fs'
import { google } from 'googleapis'
import { getOAuthClient } from '../services/googleAuth.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const auth = getOAuthClient()
    const drive = google.drive({ version: 'v3', auth })

    const response = await drive.files.create({
      requestBody: {
        name: req.file.originalname
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path)
      }
    })

    fs.unlinkSync(req.file.path)

    res.json({
      message: 'Archivo subido',
      fileId: response.data.id
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
