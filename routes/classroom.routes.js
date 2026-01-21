import express, { json } from 'express'
import { google } from 'googleapis'
import { getClassroomClient } from '../services/googleAuth.js'

const router = express.Router()

/**
 * obtener cursos totales de la cuenta
 */
router.get('/courses', async (req, res) => {
    try {
    const classroom = getClassroomClient()

    const response = await classroom.courses.list({
      teacherId: 'me'
    })

    const courses = response.data.courses || []

    const formatted = courses.map(course => ({
      id: course.id,
      name: course.name,
      section: course.section || null,
      room: course.room || null
    }))

    res.json(formatted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * Crea una tarea en un curso especificado como param (courseId)
 */
router.post('/courses/:courseId/coursework', async (req, res) => {
   try {
    const { courseId } = req.params
    const classroom = getClassroomClient()

    if (!req.body.title || req.body.title.trim() === '') {
      req.body.title = 'Tarea'
    }

    const response = await classroom.courses.courseWork.create({
      courseId,
      requestBody: {
        ...req.body,
        state: req.body.state || 'PUBLISHED'
      }
    })

    res.status(201).json(response.data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
