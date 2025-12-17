import express from 'express'
import fs from 'fs'
import { google } from 'googleapis'
import { getOAuthClient } from '../services/googleAuth.js'

const router = express.Router()

const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/drive.file'
]

router.get('/auth', (req, res) => {
  const auth = getOAuthClient()

  const url = auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES
  })

  res.redirect(url)
})

router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query
  const auth = getOAuthClient()

  const { tokens } = await auth.getToken(code)
  auth.setCredentials(tokens)

  fs.writeFileSync('token.json', JSON.stringify(tokens, null, 2))

  res.send('✅ Autenticación completada')
})

export default router
