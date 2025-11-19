const express = require('express')
const app = express()
require('dotenv').config()
const connectDB = require('./config/db')
const apiRouter = require('./routes')
const cookieparser = require('cookie-parser')
const cors = require ('cors')
const port = process.env.PORT

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({ origin: CLIENT_URL, credentials: true }))

app.use(express.json());
app.use(cookieparser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
connectDB();

app.use('/api',apiRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
