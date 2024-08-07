const express = require('express')
require('dotenv').config()
const app = express()
const connection = require('./helpers/db')
const userRoute = require('./routes/userRoute')


app.use(express.json())
app.use('/user', userRoute)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Running on server ${PORT}`);
})