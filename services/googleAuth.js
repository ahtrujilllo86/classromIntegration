import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.GOOGLE_OAUTH_TOKEN) {
  throw new Error('❌ GOOGLE_OAUTH_TOKEN no está definido')
}

const token = JSON.parse(
  Buffer.from(process.env.GOOGLE_OAUTH_TOKEN, 'base64').toString()
)

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

auth.setCredentials(token)

export function getClassroomClient () {
  return google.classroom({
    version: 'v1',
    auth
  })
}