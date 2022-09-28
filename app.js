const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');  // tell app to use ejs as its view engine
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));  // css styles will be applied

//connect to MongoDB by specifying port to access MongoDB server
main().catch(err => console.log(err));
 
async function main() {
  await mongoose.connect('mongodb://localhost:27017/todolistDB');
};

// create schema
const itemsSchema = {
    name:String
};

// create model
const Item = mongoose.model('item',itemsSchema);

// create document 
const item1 = new Item({
    name:"Welcome to your to-do list !"
});
const item2 = new Item({
    name:"Hit the + button to add a new item."
});
const item3 = new Item({
    name:"<-- Hit this to delete an item."
});

const defaultItems = [item1,item2,item3];

app.get("/",function(req,res){ 
    Item.find({},function(err,foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully saved default items to the DB.");        
                }
            });
            res.redirect("/");
        }else
        {
            res.render('list',{listTitle: "Today",newListItems:foundItems});    
        }
    });
});

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newListItems:workItems});
});

app.get("/about",function(req,res){
    res.render("about");
});

app.post("/",function(req,res){
    let item = req.body.newItem;

    if(req.body.list === "Work")
    {
        workItems.push(item);
        res.redirect("/work");
    }else
    {
        items.push(item);
        res.redirect("/");
    }
});

app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});



app.listen(3000, function(){
    console.log("Server started on port 3000");
});
