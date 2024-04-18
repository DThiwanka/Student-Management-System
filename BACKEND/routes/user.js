const router = require("express").Router();

let User = require('../models/User');


router.route('/').get((req, res) => {

    User.find().then((users) => {
        res.json(users)
    }).catch((err) => {
        console.log(err)
    })

})


router.route('/get/:id').get(async (req, res) => {
    let adId = req.params.id;

    const ad = await User.findById(adId)
        // await Patient.findOne(email);

        .then((user) => {
            res.status(200).send({ status: "User Fetched!", user })
        }).catch(() => {
            console.log(err.message);
            res.status(500).send({ status: "Error with get Admin!", error: err.message })
        })

})


//Remove After 
router.route('/add').post((req, res) => {

    const userFullName = req.body.userFullName;
    const studentId = req.body.studentId;
    const userEmail = req.body.userEmail;
    const userContactNo = req.body.userContactNo;
    const userGender = req.body.userGender;
    const userAddress = req.body.userAddress;
    const password = req.body.password;

    const newUser = new User({

        userFullName,
        studentId,
        userEmail,
        userContactNo,
        userGender,
        userAddress,
        password

    })

    newUser.save().then(() => {
        res.json("User Saved!")
    }).catch((err) => {
        console.log(err);
    })

});

//Login
// API Route for Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const usr = await User.findOne({ userEmail: userEmail, password: password });

        if (usr) {
            const response = {

                _id: usr._id,
                userFullName: usr.userFullName,
                userEmail: usr.userEmail,
                // //password,
                // gender: pat.gender,
                // bloodGroup: pat.bloodGroup,
                // address: pat.address,
                //notes: pat.notes,

            };
            res.send(response);

        } else {
            return res.status(400).json({ message: "Login Failed" });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;