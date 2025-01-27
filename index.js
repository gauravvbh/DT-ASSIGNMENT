const express = require('express');
const bodyParser = require('body-parser');
const eventsRoute = require('./routes/eventRoute');
const dbConnect = require('./config/dbConnect');
require('dotenv').config();
const app = express();
dbConnect();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/v3/app", eventsRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
});
