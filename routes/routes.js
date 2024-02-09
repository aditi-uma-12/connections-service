const express = require('express');
const User = require('../models/user');
const Connection = require('../models/connection');
const router = express.Router();
const mongoose = require('mongoose');




router.get('/users', async (req, res) => {
    try {
        const data = await User.find();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/connection', async (req, res) => {
    const { user1, user2 }=req.query;

    const connection = await Connection.findOne({
        users: { $all: [user2, user1] }
      });

    if(connection) {
        res.status(409).json({message: 'You two have already connected!'});
    }
    else{
    const newConnection = new Connection({
        users: [user1, user2]
    });

    try {
        const dataToSave = await newConnection.save();
        res.status(200).json({message: 'Connected successfully!', connection: dataToSave});
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
})




//Post Method
/*
router.post('/connection', async (req, res) => {
    const data = new User({
        name: req.body.name,
        age: req.body.age
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try {
        const data = await User.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
*/

module.exports = router;