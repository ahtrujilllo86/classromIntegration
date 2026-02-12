import express from 'express'
import authRoutes from './routes/auth.routes.js'
import classroomRoutes from './routes/classroom.routes.js'
import dotenv from 'dotenv'

dotenv.config()


const app = express()
app.use(express.json())

app.use(authRoutes)
app.use('/classroom', classroomRoutes)

app.listen(process.env.PORT, () => {
  console.log('🚀 Server running on http://localhost:3000')
})
