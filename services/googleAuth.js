import { google } from 'googleapis'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

export function getOAuthClient() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  if (fs.existsSync('token.json')) {
    const token = fs.readFileSync('token.json', 'utf8')
    if (token.trim()) {
      oAuth2Client.setCredentials(JSON.parse(token))
    }
  }

  return oAuth2Client
}
