const express = require('express');
const app = express();
const path = require('path');

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


//SUe a Routers on this server.jss filee
app.use(fileRouter);
app.use(showRouter);
app.use(downloadRouter);


const viewsPath = path.join(__dirname, '/views');

app.set("views", viewsPath);           //set a view engine
app.set('view engine', 'ejs');



app.listen(PORT, ()=>{
    console.log(`App is running on ${PORT}`);
})