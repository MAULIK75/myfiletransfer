const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
app.use(express.static('public'));
app.use(express.json());

//require a files.js and show.js from a route to access on server.js file       
const fileRouter = require('./routes/files');
const showRouter = require('./routes/show');
const downloadRouter = require('./routes/download');

//require a db.js file for connections 
const connectDB = require('./config/db');
connectDB();

//cors setup
const corsOptions = {
    origin : process.env.ALLOWED_CLIENTS.split(',')                      // splits converts strings to array
}
app.use(cors(corsOptions));                     // cors is middleware so we have to use


//Use Routers on this server.jss filee
app.use(fileRouter);
app.use(showRouter);
app.use(downloadRouter);


const viewsPath = path.join(__dirname, '/views');

app.set("views", viewsPath);           //set a view engine
app.set('view engine', 'ejs');



app.listen(PORT, ()=>{
    console.log(`App is running on ${PORT}`);
})