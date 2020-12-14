const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/healthapi", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Connection is successful....");
}).catch((e) => {
    console.log("No connection");
})