import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

// Basic middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Polar Backend Test Server',
        status: 'running',
        timestamp: new Date().toISOString()
    })
})

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
    })
})

// Simple API test route
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API is working',
        method: req.method,
        url: req.url,
        headers: req.headers
    })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err.message)
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    })
})

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`🚀 Test server running on http://localhost:${port}`)
    console.log(`📊 Health check: http://localhost:${port}/health`)
    console.log(`🧪 API test: http://localhost:${port}/api/test`)
})
