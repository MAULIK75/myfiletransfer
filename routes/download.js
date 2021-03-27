const router = require('express').Router();
const File = require("../models/file");



router.get('/files/download/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.render('download', { error: 'Link has benn expired' });
        }

        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
    } catch (error) {
        return res.render('download', { error: 'Something went wrong.' });
    }
})




module.exports = router;