import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MeetingMind API is running' })
})

app.get('/api/version', (req, res) => {
  res.json({ 
    version: '1.0.0', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

app.listen(port, () => {
  console.log(`🚀 API server running at http://localhost:${port}`)
  console.log(`📝 Health check: http://localhost:${port}/health`)
  console.log(`🔢 Version: http://localhost:${port}/api/version`)
})
