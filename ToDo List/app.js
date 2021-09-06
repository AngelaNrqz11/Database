const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
// Local Node Module
// Since "date.js" module is still a local file not located in the server
// Once the code runs below, it will try to execute all the code inside date.js and bind it to const "date"
const date = require(__dirname + "/date.js");
console.log("Module 'date.js': ", date);

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// create a new folder called "public" and place your static files in it (ex: css, images, js files)
// express.static("public") will provide a path for the static files that will be kept in one place
// then you can refer to your static files using this relative "public" folder.
app.use(express.static("public"));

// CONNECT TO MONGODB USING MONGOOSE
mongoose.connect("mongodb://localhost:27017/ToDoListDB", {
    useNewUrlParser: true,
});

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name field not detected. Cancel adding to database."],
    },
});

const Item = mongoose.model("item", itemsSchema);

const listsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "List name field not detected. Cancel adding to database.",
        ],
    },
    items: [itemsSchema],
});

const List = mongoose.model("list", listsSchema);

const item1 = new Item({
    name: "Finish Udemy Section 30.",
});
const item2 = new Item({
    name: "Finish Work.",
});
const item3 = new Item({
    name: "Finish Workin Out.",
});
const defaultItems = [item1, item2, item3];

// Global variables
const workItems = ["Create essays"];
const day = date.getDay();

app.get("/", (request, response) => {
    Item.find({}, (err, results) => {
        if (err) {
            console.log("Error: Find() all.");
        } else if (results.length === 0) {
            // If To Do List is empty.
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log("To Do list error. ");
                } else {
                    console.log("Successfully added items.");
                }
            });
            response.redirect("/");
        } else {
            response.render("todo", { listTitle: day, listItem: results });
        }
    });
});

app.post("/", (request, response) => {
    console.log("Post /", request.body.list, " : ", request.body);
    const todoTitle = request.body.list;
    const todoAdd = request.body.todo;

    const itemTemp = new Item({
        name: todoAdd,
    });
    if (day === todoTitle) {
        itemTemp.save();
        response.redirect("/");
    } else {
      List.findOne({name: todoTitle}, (err, results)=>{
        if (err) {
            console.log("Error: Unable to find list ", todoTitle);
        } else if (results === null) {
            console.log("Error: List does not exist. ");
        } else {
            results.items.push(itemTemp);
            results.save();
            response.redirect("/" + todoTitle);
        }
      });
    }
});

app.post("/delete", (req, res) => {
    // Returns the value attribute of the checkbox
    const checkedItemID = req.body.checkItem;
    const todoTitle = req.body.listName;

    if (day === todoTitle) {
      Item.deleteOne({ _id: checkedItemID }, (err) => {
          if (err) {
              console.log("Error: Unable to delete.");
          } else {
              console.log("Deleted a record.");
              res.redirect("/");
          }
      });
    } else {
      List.findOneAndUpdate({name: todoTitle}, {$pull: {items: {_id: checkedItemID}}}, (err, listResult) => {
        if (err) {
            console.log("Error: Unable to find listResult ", listResult);
        } else {
            console.log("Deleted a record in List ", todoTitle);
            res.redirect("/" + todoTitle);
        }
      });
    }

});

// Express Route Parameters
app.get("/:customListName", (req, res) => {
    const listName = _.capitalize(req.params.customListName);
    console.log("List Name: ", listName);

    List.findOne({ name: listName }, (err, results) => {
      console.log("List.findOne: ", results);
        if (err) {
            console.log("Error: Unable to find list ", listName, results);
        } else if (results === null) {
            console.log("Add new list.");
            // Add default list items to new list.
            const listTemp = new List({
                name: listName,
                items: defaultItems,
            });

            listTemp.save();
            res.redirect("/" + listName);
        } else {
            res.render("list", {
                listTitle: listName,
                listItem: results.items,
            });
        }
    });
});

app.listen(3000, () => {
    console.log("Listening to port 3000.");
});
