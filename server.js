import express from 'express'
import fs from 'fs'
import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.json())

const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly'
]

const CREDENTIALS_PATH = './credentials.json'
const TOKEN_PATH = './token.json'

// Crear cliente OAuth
function getOAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH))
  const config = credentials.web || credentials.installed

  const { client_secret, client_id, redirect_uris } = config

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

   // 👉 SOLO cargar token si existe y tiene contenido
  if (fs.existsSync('token.json')) {
    const tokenContent = fs.readFileSync('token.json', 'utf8')

    if (tokenContent.trim() !== '') {
      oAuth2Client.setCredentials(JSON.parse(tokenContent))
    }
  }
//   const token = JSON.parse(fs.readFileSync('./token.json'))
//   oAuth2Client.setCredentials(token)

  return oAuth2Client
}

// Obtener URL de autenticación
app.get('/auth', (req, res) => {
  const oAuth2Client = getOAuthClient()

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/classroom.rosters.readonly',
      'https://www.googleapis.com/auth/classroom.coursework.students'
    ]
  })

  res.json({ url: authUrl })
})

// Callback OAuth
app.get('/oauth2callback', async (req, res) => {

    try {
        console.log('QUERY:', req.query)

        const oAuth2Client = getOAuthClient()
        const code = req.query.code

        if (!code) {
        return res.status(400).send('❌ No llegó el code')
        }

        const { tokens } = await oAuth2Client.getToken(code)

        fs.writeFileSync('./token.json', JSON.stringify(tokens, null, 2))

        res.send('✅ Token creado correctamente')
    } catch (err) {
        console.error('ERROR TOKEN:', err)
        res.status(500).send('Error generando token')
    }
})

// Cliente autenticado
function getAuth() {
  const oAuth2Client = getOAuthClient()
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH))
  oAuth2Client.setCredentials(token)
  return oAuth2Client
}

//
// 📘 Obtener cursos
//
app.get('/courses', async (req, res) => {
  try {
    const auth = getAuth()
    const classroom = google.classroom({ version: 'v1', auth })

    const response = await classroom.courses.list()
    res.json(response.data.courses || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

//
// 👥 Obtener alumnos de un curso
//
app.get('/courses/:courseId/students', async (req, res) => {
  try {
    const auth = getAuth()
    const classroom = google.classroom({ version: 'v1', auth })

    const response = await classroom.courses.students.list({
      courseId: req.params.courseId
    })

    res.json(response.data.students || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// crear tarea en un curso
app.post('/courses/:courseId/coursework', async (req, res) => {
  try {
    const auth = getOAuthClient()
    const classroom = google.classroom({ version: 'v1', auth })

    const {
      title,
      description,
      maxPoints,
      dueDate,
      dueTime
    } = req.body

    const coursework = {
      title,
      description,
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
      maxPoints: maxPoints ?? 100,

      ...(dueDate && {
        dueDate: {
          year: dueDate.year,
          month: dueDate.month,
          day: dueDate.day
        }
      }),

      ...(dueTime && {
        dueTime: {
          hours: dueTime.hours,
          minutes: dueTime.minutes
        }
      })
    }

    const response = await classroom.courses.courseWork.create({
      courseId: req.params.courseId,
      requestBody: coursework
    })

    res.json({
      message: '✅ Tarea creada correctamente',
      data: response.data
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})


app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000')
})
