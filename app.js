require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

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

// SignUp Route
app.post('/user/register', async (req, res) => {
    try {
        // Gather all values
        const { firstname, lastname, email, password } = req.body;
        // check mandatory fields
        if (!(firstname && lastname && email && password)) {
            res.status(401).send('All fields are mandatory')
        }
        // check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(401).send("User already found in database")
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

        //create a token and send it to user
        const token = jwt.sign({
            // payload contains _id
            id: newUser._id
        }, 'shhhhh', { expiresIn: '2h' });

        // this token is not been saved in database
        newUser.token = token
        //don't want to send the password to the user and also not changing the user's db password
        newUser.password = undefined;

        res.status(201).json({
            message: 'User created successfully',
            data: newUser,
        });
    } catch (error) {
        console.log(error)
        console.log("/user/register route doesn't respond")
    }
})


// Login route
app.post('./login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!(email && password)) {
            res.status(401).send('both fields are mandatory')
        }
        const user = await User.findOne({ email })

        // if (!(user)) {
        //     res.status(401).send('user is not signed up')
        // }

        // check is user exists and entered password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            // create token
            const token = jwt.sign({ id: user._id, email }, 'shhhhh', { expiresIn: '2h' })
            user.token = token
            user.password = undefined
            // TODO: save token to the cookie
            res.status(201).json({ user })
        }

    } catch (error) {
        console.log(error)
        console.log('/login route not responding')
    }
})

module.exports = app;