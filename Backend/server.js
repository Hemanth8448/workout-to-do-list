require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')

// express app
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

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        if (process.env.NODE_ENV !== 'production') {
            app.listen(process.env.PORT || 4000, () => {
                console.log('Server running on port', process.env.PORT || 4000);
            });
        }
    })
    .catch((error) => {
        console.log(error)
    })
module.exports = app