const express = require('express')
const bodyParser = require('body-parser')

// Import the responseApi.js
const { success, error, validation } = require("./responseApi");


const app = express();
const connectToMongoDB = require("./config/db");

// Connect to MongoDB
connectToMongoDB();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// models
const Address = require('./model/models')


app.post('/user', (req, res) => {
    const name = req.body.name,
        email = req.body.email,
        phone = req.body.phone,
        place = req.body.place;

    let newAddress = new Address({
        name: name,
        email: email,
        phone: phone,
        place: place
    })


    newAddress.save().then((address) => {
        return res
            .status(200)
            .json(success("OK", address, res.statusCode));

    }).catch((err) => {
        res.status(500).json(error("Something went wrong", res.statusCode));
    })
})


app.get('/user/:id', (req, res) => {
    Address.findById(req.params.id, (err, user) => {
        if (!user) {
            return res.status(500).json(error("Something went wrong", res.statusCode));
        }

        return res
            .status(200)
            .json(success("OK", user, res.statusCode));
    })
})

app.get('/all', (req, res) => {
    Address.find({}, (err, user) => {
        if (!user) {
            return res.status(500).json(error("Something went wrong", res.statusCode));
        }

        return res
            .status(200)
            .json(success("OK", user, res.statusCode));
    })
})


app.post('/user/update/:id', (req, res) => {
    let address = {}
    if (req.body.name) address.name = req.body.name
    if (req.body.email) address.email = req.body.email
    if (req.body.phone) address.phone = req.body.phone
    if (req.body.place) address.place = req.body.place
    address = { $set: address }
    Address.update({ _id: req.params.id }, address).then(() => {
        return res
            .status(200)
            .json(success("OK", address, res.statusCode));
    }).catch((err) => {
        return res.status(500).json(error("Something went wrong", res.statusCode));

    })
})


app.delete('/user/delete/:id', (req, res) => {
    Address.remove({ _id: req.params.id }).then(() => {
        return res
            .status(200)
            .json(success("OK", "user deleted", res.statusCode));
    }).catch((err) => {
        return res.status(500).json(error("Something went wrong", res.statusCode));
    })
})


// Run the server
app.listen(5000, () => console.log(`Server running in 5000`));