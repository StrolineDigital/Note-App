//This block of constants will require the express package and the fs package and connect the file to the html-routes.js file
const routes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const {Router} = require('express');
const router = require ("./html-routes.js");

//This GET route reads the db.json file and returns all saved notes as JSON.

router.get('/notes', async(res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json(JSON.parse(data));
        console.log(data);
    });
});

//This POST route receives a new note to save on the request body, adds it to the db.json file,
// and then returns the new note to the client.

router.post('/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            res.json(newNote);
            console.log(newNote);
        });
    });
});

//This DELETE route receives a query parameter containing the id of a note to delete.

router.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const notes = JSON.parse(data);
        const filteredNotes = notes.filter(note => note.id !== id);
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            res.json({ ok: true });
            console.log ('Note deleted')
        });
    });
});
//This exports the routes to be used in the server.js file
module.exports = router;