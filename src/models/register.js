const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//Schema
const RegisterSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true,
        // minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
    healthapi: [{
        healthname: {
            type: String,
            required: true
        },
        healthnumber: {
            type: Number,
            required: true
        },
        healthimage: {
            type: String,
            required: true
        },
        healthurl: {
            type: String,
            required: true
        },
        healthmessage: {
            type: String,
            required: true
        },
        CeateTime: {
            type: Date,
            default: Date.now
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

//health api create
RegisterSchema.methods.genereteHealthApi = async function(healthname, healthnumber, healthimage, healthurl, healthmessage) {
    try {
        console.log(this._id);
        console.log(healthname);
        const id = this._id;
        this.healthapi = this.healthapi.concat({
            healthname: healthname,
            healthnumber: healthnumber,
            healthimage: healthimage,
            healthurl: healthurl,
            healthmessage: healthmessage
        });
        console.log(healthname);
        await this.save();
        console.log(healthname);
        return id;

    } catch (error) {
        res.send("the error part" + error);
        // console.log("the error part" + error);
    }
}

//generete token
RegisterSchema.methods.genereteAuthToken = async function() {
    try {
        // console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;

    } catch (error) {
        res.send("the error part" + error);
        // console.log("the error part" + error);
    }
}

//middleware
RegisterSchema.pre("save", async function(next) {

    if (this.isModified("password")) {
        // console.log(`current password: ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`current password: ${this.password}`);
        this.confirmPassword = await bcrypt.hash(this.password, 10);
        // this.confirmPassword = undefined;
    }
    next();
});


// we will create a new colleton
const Register = new mongoose.model('health', RegisterSchema);

module.exports = Register;