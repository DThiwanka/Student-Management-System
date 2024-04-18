const router = require("express").Router();

let superad = require('../models/SuperAd');

router.route('/').get((req, res) => {

    User.find().then((superadmins) => {
        res.json(superadmins)
    }).catch((err) => {
        console.log(err)
    })

})

module.exports = router;