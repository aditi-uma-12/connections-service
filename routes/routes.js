const express = require('express');
const User = require('../models/testuser');
const Connection = require('../models/testconnection');
const router = express.Router();


function sendEventsToAll(connection) {
    console.log(connection);
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(connection)}\n\n`));
}

router.get('/users', async (req, res) => {
    try {
        const data = await User.find();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
});

router.get('/connections', async (req, res) => {
    try {
        const data = await Connection.find();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
});

router.post('/connect', async (req, res) => {
    const { user1, user2 } = req.query;

    const connection = await Connection.findOne({
        users: { $all: [user2, user1] }
    });


    if (connection) {
        res.status(409).json({ message: 'You two have already connected!' });
        console.log('Already connected');

    }
    else {
        const newConnection = new Connection({
            users: [user1, user2].sort()
        });

        try {
            const dataToSave = await newConnection.save();
            sendEventsToAll(dataToSave);
            res.status(200).json({ message: 'Connected successfully!', connection: dataToSave });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    }


})
    router.get('/connectionevents', async function (req, res) {
        console.log('Got /events');
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        });
        res.flushHeaders();

        // Tell the client to retry every 10 seconds if connectivity is lost
        res.write('retry: 10000\n\n');

        const clientId = Date.now();

        const newClient = {
            id: clientId,
            res
        };

        clients.push(newClient);

        req.on('close', () => {
            console.log(`${clientId} Connection closed`);
            clients = clients.filter(client => client.id !== clientId);
        });

    });

module.exports = router;