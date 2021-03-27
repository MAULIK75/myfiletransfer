const router = require('express').Router();
const File = require("../models/file");

//for show a generated endpoint or you can say dowanload a file link

router.get('/files/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.render('download', { error: 'Link has benn expired' });
        }
        return res.render('download', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        })


    } catch (error) {
        return res.render('download', { error: 'Something went wrong.' });
    }
});

module.exports = router;