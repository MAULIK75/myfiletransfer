const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require("../models/file");
const { v4: uuidv4 } = require('uuid');

// file is store into disk storage in multer -- this is the simple proccesure
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})

let upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 * 100 } //100 mb
}).single('myfile');


//upload file using post
router.post('/api/files', (req, res) => {


    //Store file
    upload(req, res, async (err) => {

        //Validate request files from using POST  -- it will check it is validate or not
        if (!req.file) {
            return res.json({ error: "Something went wrong!!" });
        }

        if (err) {
            res.status(500).send({ erroe: err.message })
        }

        //Store into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        })

        const response = await file.save();
        // it will return genarated file page link
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });

    });
});


router.post('/api/files/send', async (req, res) => {

    const { uuid, emailTo, emailFrom } = req.body;
    //valiadte a mail 
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: "All feilds are require" });
    }

    // Get the file from database
    const file = await File.findOne({ uuid: uuid });

    if (file.sender) {                                                                  //it is check email is send before or not
        return res.status(422).send({ error: "Email is already sent>>>" });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const responce = await file.save();

    //send a email

    const sendMail = require('../services/emailService');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'File transfer',
        text: `${emailTo} shared a file for you`,
        html: require('../services/emailtemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1000) + ' KB',
            expires: '24 hours'

        })
    });
    return res.send({ success: true });

});


module.exports = router;