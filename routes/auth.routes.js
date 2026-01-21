import express from 'express'
import { google } from 'googleapis'

const router = express.Router()

const SCOPES = [
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/classroom.courses'
]

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

/**
 * Paso 1: Redirige a Google (SOLO SETUP)
 */
router.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES
  })

  res.redirect(url)
})

/**
 * Paso 2: Callback
 * Convierte token → Base64
 */
router.get('/oauth2callback', async (req, res) => {
    try {
    const { code } = req.query

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const base64Token = Buffer.from(
      JSON.stringify(tokens)
    ).toString('base64')

    res.send(`
      <h2>✅ Autenticación completada</h2>
      <p>Copia este valor y guárdalo en Railway como:</p>
      <pre>GOOGLE_OAUTH_TOKEN=${base64Token}</pre>
      <p>⚠️ Guarda esto en un lugar seguro</p>
      <p>Luego puedes eliminar esta ruta</p>
    `)
  } catch (err) {
    res.status(500).send('❌ Error autenticando')
  }
})

export default router
