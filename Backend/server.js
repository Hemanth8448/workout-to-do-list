require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const serverless = require('serverless-http') // ✅ Required for Vercel

const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')

const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

// connect to db (outside of handler to persist connection)
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(' Connected to MongoDB Atlas')
    })
    .catch((error) => {
        console.log(' MongoDB connection error:', error)
    })

// ✅ Export app handler for Vercel
module.exports.handler = serverless(app)
