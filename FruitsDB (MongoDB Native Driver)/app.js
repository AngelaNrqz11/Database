const MongoClient = require("mongodb").MongoClient;
// “assert” has always something to do with testing.
// Adding code to your MongoDB application has a lot of “assert”s that just validates the data entry and connection to your MongoDB Database.
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name: FruitsDB
const dbName = "FruitsDB";

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server.");

    // If DB does not exist, this code will by defualt, create one.
    const db = client.db(dbName);

    insertDocuments(db, function () {
        findDocuments(db, function () {
            client.close();
        });
    });
});

const insertDocuments = function (db, callback) {
    console.log("INSERTING DOCUMENTS");
    // Get/Create the collection/table name
    // If collection does not exist, creates one by default.
    const collection = db.collection("fruits");
    // Insert some documents/records
    collection.insertMany(
        [
            {
                name: "Strawberry",
                sweetnes: 7,
                review: "Sweet but not too much.",
            },
            {
                name: "Apple",
                sweetnes: 6,
                review: "Not good when eating it on an empty stomach.",
            },
            {
                name: "Mango",
                sweetnes: 10,
                review: "I just love it",
            },
        ],
        function (err, result) {
            console.log("Assert: Check if inserted documents are null.");
            // Validate to ensure there are no errors when inserting the documents.
            assert.equal(err, null);
            console.log("Assert: Check if 3 documents are added.");
            // Ensures there are 3 results inserted into the collection.
            console.log("Print 'result' return value: ", result);
            // assert.equal(3, result.result.n);        //Code not supported anymore. Updated to the one below.
            assert.equal(3, result.insertedCount);
            // assert.equal(3, result.ops.length);      //Code not supported anymore. Updated to the one below.
            assert.equal(3, Object.keys(result.insertedIds).length);
            console.log("Inserted 3 documents into the collection");
            callback(result);
        }
    );
};

const findDocuments = function (db, callback) {
    console.log("FIND DOCUMENTS (PRINT ALL)");
    // Get the documents collection
    const collection = db.collection("fruits");
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records:");
        console.log(docs);
        callback(docs);
    });
};
