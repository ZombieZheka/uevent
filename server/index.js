import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import corsOptions from './config/corsOptions.js'
import router from './routes/api.js'
import eventRouter from './routes/eventRoutes.js'
import userRouter from './routes/userRoutes.js'
import verifyJWT from './middleware/verifyJWT.js'

const app = express()
mongoose.connect('mongodb://localhost:27017/Uivent')

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use('/api',router)
app.use('/dash', verifyJWT, eventRouter)
app.use('/dash', verifyJWT, userRouter)
app.use((err, req, res, next)=>{
    res.status(422).send({err: err.message})
})

app.listen(process.env.port || 4000, ()=>{
    console.log("Now listening for requests")
})