const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const htmlRoutes = require("./html-routes.js");
const app = express();
app.use(express.json());

router.get('/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        try {
            const notes = JSON.parse(data);
            res.json(notes);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            return res.status(500).json({ error: 'Invalid JSON data' });
        }
    });
});

router.post('/notes', async (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4(),
    };
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        
        let notes;
        try {
            notes = JSON.parse(data);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            return res.status(500).json({ error: 'Invalid JSON data' });
        }

        notes.push(newNote);
        
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to write file' });
            }
            res.json(newNote);
            console.log('Note added:', newNote);
        });
    });
});


router.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        try {
            const notes = JSON.parse(data);
            const filteredNotes = notes.filter(note => note.id !== id);
            fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Failed to write file' });
                }
                res.json({ ok: true });
                console.log('Note deleted');
            });
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            return res.status(500).json({ error: 'Invalid JSON data' });
        }
    });
});

module.exports = router;