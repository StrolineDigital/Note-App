const express = require('express');
const html_routes = require('./Develop/public/routes/html-routes');
const api_routes = require('./Develop/public/routes/api-routes');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/api', api-routes);
app.use('/', html-routes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});