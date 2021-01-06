const mongoose = require('mongoose');
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/";

mongoose.connect(url, () =>{
    const datacollection = db.db("healthapi")},
    {useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Connection is successful....");
}).catch((e) => {
    console.log("No connection");
})
