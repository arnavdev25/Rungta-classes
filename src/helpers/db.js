const mongoose = require('mongoose');


const connection = mongoose.connect('mongodb://127.0.0.1:27017/social-application')
    .then(() => console.log('connection established'))
    .catch((ex) => console.log(ex))


module.exports = connection;