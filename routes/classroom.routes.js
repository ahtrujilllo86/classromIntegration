import express from 'express'
import { google } from 'googleapis'
import { getOAuthClient } from '../services/googleAuth.js'

const router = express.Router()

// Obtener cursos
router.get('/courses', async (req, res) => {
  try {
    const auth = getOAuthClient()
    const classroom = google.classroom({ version: 'v1', auth })

    const response = await classroom.courses.list()
    res.json(response.data.courses || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Crear tarea
router.post('/courses/:courseId/coursework', async (req, res) => {
  try {
    const { courseId } = req.params
    const auth = getOAuthClient()
    const classroom = google.classroom({ version: 'v1', auth })

    const work = await classroom.courses.courseWork.create({
      courseId,
      requestBody: req.body
    })

    res.json(work.data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
