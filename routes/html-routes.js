// Requires path and express
const router = require("express").Router();
const path = require("path");
// GET /notes should return the notes.html file.
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});
// GET *  returns the index.html file.
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
// Export the router
module.exports = router;