require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

app.use(cors())
app.use(express.json())
mongoose.connect('mongodb+srv://nodejs:nodejs@cluster0.zoxgxam.mongodb.net/test')

app.post("/api/register", async (req, res) => {
    console.log(req.body)
    try {
        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(req.body.password, salt)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword
        })
        res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
        res.json({ status: "error", error: "duplicate found" })
    }
})


app.post("/api/login", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if (user == null) res.json({ status: "user not found" })
    else {
        const passwordcompared = await bcrypt.compare(req.body.password, user.password)
        if (!passwordcompared) return res.json({ status: "Incorrect Credentials" })
    }
    console.log(user)
    if (user) {
        const token = jwt.sign({
            name: user.name,
            email: user.email
        }, process.env.Access_Token)
        return res.json({ status: "ok",name : user.name, email:user.email, token })
    }
    else {
        return res.json({ status: "error", user: false })
    }

})

// app.get('/', (req, res)=>{
//     console.log("sadfsfsdf")
//     res.send("asdsadf")
// })


app.listen(6969, () => {
    console.log("server started")
})