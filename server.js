const express = require('express');
const html_routes = require('./routes/html-routes.js');
const api_routes = require('./routes/api-routes.js');
const PORT = process.env.PORT || 3001;
const app = express();
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/api', api_routes);
app.use('/', html_routes);
// Starts the server on the port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});