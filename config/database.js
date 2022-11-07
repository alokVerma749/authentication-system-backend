const mongoose = require('mongoose');

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(
            console.log('DB connection successfull')
        )
        .catch(error => {
            console.log('DB connection unsuccessfull')
            console.log(error)
            process.exit(1)
        })
}