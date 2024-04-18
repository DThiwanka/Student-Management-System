const router = require("express").Router();

let admin = require('../models/Admin');

router.route('/').get((req, res) => {

    User.find().then((admins) => {
        res.json(admins)
    }).catch((err) => {
        console.log(err)
    })

})


module.exports = router;