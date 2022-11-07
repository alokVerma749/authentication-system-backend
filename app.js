require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const bcrypt = require("bcryptjs")

const User = require('./models/user')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello from home route');
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json({
            message: 'Users fetched successfully',
            data: users,
        })
    } catch (error) {
        console.log('/users route not responding')
        console.log(error)
    }
})


app.post('/user/register', async (req, res) => {
    try {
        // Gather all values
        const { firstname, lastname, email, password } = req.body;
        // check mandatory fields
        if (!(firstname && lastname && email && password)) {
            console.log('All fields are mandatory')
        }
        // check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`${email} user already exist`)
            process.exit()
        }

        // encrypt the password
        const encry_password = await bcrypt.hash(password, 10);

        // create new entry in database
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: encry_password
        })
        res.json({
            message: 'User created successfully',
            data: newUser,
        });

        //create a token and send it to user

    } catch (error) {
        console.log(error)
        console.log("/user/register route doesn't respond")
    }
})

module.exports = app;