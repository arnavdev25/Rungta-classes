const express = require('express')
require('dotenv').config()
const app = express()
const connection = require('./helpers/db')
const userRoute = require('./routes/userRoute')


app.use(express.json())
app.use('/user', userRoute)


app.listen(8080, () => {
    console.log(`Running on server 8080`);
})