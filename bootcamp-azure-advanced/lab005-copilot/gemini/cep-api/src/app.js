const express = require('express');
const setCepRoutes = require('./routes/cepRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setCepRoutes(app); // Apply the routes to the app

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;