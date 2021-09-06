const mongoose = require("mongoose");

// CONNECTING TO A SPECIFIC MONGODB DATABASE
// mongodb://localhost:27017 <-- This specifies the port where we can access the MongoDB server.
// add a /<database name> to specify what DB to create/connect to.
mongoose.connect("mongodb://localhost:27017/FruitsDB", {
    // (node:12488) DeprecationWarning: current URL string parser is deprecated, and will be
    // removed in a future version.
    // To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
    useNewUrlParser: true,

    // (node:12488) [MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine
    // is deprecated, and will be removed in a future version. To use the new Server Discover
    // and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient
    // constructor.
    useUnifiedTopology: true,
});

// CREATING A SCHEMA FOR THE COLLECTION (TABLE)
// Structuring data to be saved in the MongoDB database.
// Will be the foundation when adding every <table name> document to the db.
const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "No name was specified. Data insertion halted."],
    },
    sweetness: {
        type: Number,
        min: 1,
        max: 10,
    },
    review: String,
});

// CREATING FRUIT COLLECTION (TABLE) MONGOOSE MODEL
// Use the schema to create a new Mongoose Model.
// 1st Parameter (type string and must be singular): name of the collection that will comply
// with the FruitSchema.
// Mongoose way is to specify the singular name of your collection and it will automatically
// convert your string into plural form and all lower cased then create your collection.
// 2nd Parameter (type mongoose.Schema): structure your 1st parameter must follow.
const Fruit = mongoose.model("Fruit", fruitSchema);

// CREATING A FRUIT DOCUMENT
// Creating a "fruit" document from the "Fruit" Model
const fruit = new Fruit({
    name: "Oreo",
    sweetness: 10,
    review: "Just perfect!",
}); // ms ev save

// Tells Mongoose to save your fruit document, inside the Fruit collection, inside the FruitsDB.
fruit.save();

const strawberry = new Fruit({
    name: "Strawberry",
    sweetness: 6,
    review: "Not too sweet though.",
});

const banana = new Fruit({
    name: "Banana",
    sweetness: 7,
    review: "Sweet but sick of it.",
});

const dragonfruit = new Fruit({
    name: "Dragon Fruit",
    sweetness: 5,
    review: "Confusing.",
});

// INSERTING MANY DOCUMENTS INTO A COLLECTION
Fruit.insertMany([strawberry, banana, dragonfruit], (error) => {
    if (error) {
        console.log("Error has occurred:(insert) ", error);
    } else {
        console.log("Successfully added new fruits to the database.");
    }
});

Fruit.updateOne(
    { _id: "612d2473d2bc04349c38c6a9" },
    {
        name: "Only Oreo",
        sweetness: 1,
    },
    (err) => {
        if (err) {
            console.log("Error updating: ", err);
        } else {
            console.log("Successfully Updated.");
        }
    }
);

Fruit.deleteOne({ name: "Only Oreo" }, (err) => {
    if (err) {
        console.log("Error deleting document.");
    } else {
        console.log("Successfully Deleted.");
    }
});

// Encountered Error: (node:83559) UnhandledPromiseRejectionWarning:
// MongoInvalidArgumentError: Method "collection.find()" accepts at most two arguments
// Solution:
// Just run "npm uninstall mongoose" <= to uninstall the current mongoose version 6.
// Then run "npm i mongoose@5.13.8" <= installs the version that will fix the issue.
Fruit.find((err, fruitsRet) => {
    if (err) {
        console.log("Error has occurred:(find) ", err);
    } else {
        fruitsRet.forEach((temp) => {
            console.log("Name:", temp.name, temp.sweetness);
        });

        // Good practice: close the connection when you're done.
        mongoose.connection.close();
    }
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 1,
    },
    favoriteFruit: fruitSchema,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name: "Amy",
    age: 12,
    favoriteFruit: strawberry,
});

person.save();

Person.updateOne({ name: "John" }, { favoriteFruit: banana }, (err) => {
    if (err) {
        console.log("Error has occurred when updating.");
    } else {
        console.log("John has now a new favorite fruit.");
    }
});
