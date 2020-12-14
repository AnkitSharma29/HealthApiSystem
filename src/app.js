require('dotenv').config()
const express = require("express");
const path = require("path");
const hbs = require('hbs');
const exphbs = require('express-handlebars');
const url = require('url');
require("./db/conn");
const app = express();
const Register = require("./models/register");
const port = process.env.PORT || 8000;
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const auth = require("./middleware/auth");
const jwt = require("jsonwebtoken");

// public static path
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

//midlawere
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.use(express.static(static_path)) // For serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routing
app.get("/", (req, res) => {
    const username = { "username": req.cookies.username }
    res.render('index', username);

});

app.get("/secret", auth, (req, res) => {
    // console.log(`save cookies in local storage ${req.cookies.jwt}`);
    res.render('secret');

});

//health api create
app.get("/health", (req, res) => {
    // console.log(`save cookies in local storage ${req.cookies.jwt}`);
    res.render('health');

});

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/weather', (req, res) => {
    res.render('weather');
})

app.get('/contacts', (req, res) => {
    res.render('contacts');
})

app.get('/login', (req, res) => {

    const username = { "username": req.cookies.username }

    res.render('login', username);
})

app.get('/logout', async(req, res) => {

    try {
        const veryfyUser = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
        const user = await Register.findOne({ _id: veryfyUser._id });
        // console.log(veryfyUser);
        const DeleteAccount = { "DeleteAccount": veryfyUser._id, "Loginusersize": user.tokens.length };
        // console.log(DeleteAccount);
        // console.log(user.tokens.length);
        res.render("logout", DeleteAccount);
    } catch (error) {
        res.render("index");
    }
});

app.get('/logoutsingle', auth, async(req, res) => {
    try {
        // console.log(req.user._id);
        // console.log(req.user.tokens); //All the token print
        // console.log(req.user.tokens.length); //All the token size print

        // for single device logout
        req.user.tokens = req.user.tokens.filter((curretUserToken) => {
            return curretUserToken.token != req.token
        });

        // LOGOUT all Device
        // req.user.tokens = [];

        res.clearCookie("jwt");
        res.clearCookie("username");
        console.log("Log out successful");

        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }

});

app.get('/logoutmul', auth, async(req, res) => {

    try {
        // console.log(req.user);

        //for single device logout
        // req.user.tokens = req.user.tokens.filter((curretUserToken) => {
        //     return curretUserToken.token != req.token
        // });

        // LOGOUT all Device
        req.user.tokens = [];

        res.clearCookie("jwt");
        res.clearCookie("username");
        console.log("Log out successful");

        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }

})

//secure register
app.post("/contacts", async(req, res) => {

    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password === confirmPassword) {

            const user = new Register({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                phone: req.body.phone,
                message: req.body.message
            });

            // console.log("the succcess part " + user);
            const token = await user.genereteAuthToken();
            // console.log("the token part " + token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000)
            });

            res.cookie("username", user.username, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true,
                // secure:true
            });

            // console.log(cookie);
            // console.log(cookies.get("jwt"));


            const createuser = await user.save();
            // console.log("the page part " + createuser);
            const username = { "username": req.body.username };
            res.status(201).render('index', username);
        } else {
            res.status(400).send("Please check password confirm..");
        }
    } catch (e) {
        res.status(400).send(e);
    }

})

// //login register
app.post("/login", async(req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        // console.log(email);

        const userData = await Register.findOne({ email: email });

        // console.log(userData.password);
        // console.log(req.body.password);
        const passwordmatch = await bcrypt.compare(password, userData.password)
            // console.log(passwordmatch);

        const token = await userData.genereteAuthToken();
        // console.log("the token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true,
            // secure:true
        });

        res.cookie("username", userData.username, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true,
            // secure:true
        });

        if (passwordmatch) {
            const username = { "username": req.cookies.username }
            res.status(201).render('index', username);
        } else {
            res.status(400).send("Please valid login.");
        }
    } catch (e) {
        res.status(400).send(e);
    }

});


//health api create
app.post("/health", async(req, res) => {

    try {
        const healthname = req.body.healthname;
        const healthnumber = req.body.healthnumber;
        const healthimage = req.body.healthimage;
        const healthurl = req.body.healthurl;
        const healthmessage = req.body.healthmessage;


        const veryfyUser = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
        const healthuser = await Register.findOne({ _id: veryfyUser._id });

        const token = await healthuser.genereteHealthApi(healthname, healthnumber, healthimage, healthurl, healthmessage);
        res.status(201).render('index');
    } catch (e) {
        res.status(400).send(e);
    }

});

//crud app
app.get('/crud', async(req, res) => {
    await Register.find((err, docs) => {
        if (!err) {
            res.status(201).render("crud", {
                list: docs
            });
        } else {
            console.log('Error in retrieving crud list :' + err);
        }
    });
});

//delete the students by it id
app.get("/delete/:id", async(req, res) => {
    try {

        // const _id = req.params.id;

        const deletStudent = await Register.findByIdAndDelete(req.params.id);

        if (!req.params.id) {
            return res.status(400).redirect("../crud");
        }

        //delete account cookies delete
        res.clearCookie("jwt");
        res.clearCookie("username");

        res.status(400).redirect('../');
    } catch (e) {
        res.status(500).send(e);
    }
});

// update crud
app.get('/update', (req, res) => {
    res.render('update');
})



//404 error page
app.get('*', (req, res) => {
    res.render("404error", {
        errorMsg: 'Opps! Page Not Found'
    });
})

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});