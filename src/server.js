const express = require('express')
require('dotenv').config()
const app = express()
const connection = require('./helpers/db')
const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute')
const commentRoute = require('./routes/commentRoute')


app.use(express.json())
app.use('/user', userRoute)
app.use('/posts', postRoute)
app.use('/post/comments', commentRoute)


const PORT = process.env.PORT
app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`Running on server ${PORT}`);
    }
    catch (ex) {
        console.log(ex);
    }
})