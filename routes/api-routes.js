const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const htmlRoutes = require("./html-routes.js");
const app = express();
app.use(express.json());

// GET /api/notes should read the db.json file and return all saved notes as JSON.
router.get('/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        // If there's an error reading the file, return an error response
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        // Try to parse the JSON data
        try {
            const notes = JSON.parse(data);
            res.json(notes);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            return res.status(500).json({ error: 'Invalid JSON data' });
        }
    });
});
// POST /notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
router.post('/notes', async (req, res) => {
    // Validate the request body and apply an ID to the new note
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4(),
    };
    // Read the current notes from the file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        // Parse the JSON data
        let notes;
        try {
            notes = JSON.parse(data);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            return res.status(500).json({ error: 'Invalid JSON data' });
        }
// Add the new note to the array of notes
        notes.push(newNote);
        // Write the updated notes back to the file
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to write file' });
            }
            // Send the new note back to the client
            res.json(newNote);
            console.log('Note added:', newNote);
        });
    });
});

// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
router.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        try {
            // Parse the JSON data
            const notes = JSON.parse(data);
            // Filter out the note with the given ID
            const filteredNotes = notes.filter(note => note.id !== id);
            fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Failed to write file' });
                }
                // Send a response back to the client
                res.json({ ok: true });
                console.log('Note deleted');
            });
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            return res.status(500).json({ error: 'Invalid JSON data' });
        }
    });
});
// Export the router
module.exports = router;