const File = require("./models/file");
const fs = require('fs');

//require a db.js file for connections 
const connectDB = require('./config/db');
connectDB();

async function deleteData() {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const files = await File.find({ createdAt: { $lt: pastDate } });
    if (files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`file remove successfully ${file.filename}`);
            } catch (error) {
                console.log(`error while deleting file ${error}`);
            }
        }
        console.log("Job is done");
    }
}

deleteData().then(process.exit)