const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine','ejs');  // tell app to use ejs as its view engine
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));  // css styles will be applied

//connect to MongoDB by specifying port to access MongoDB server
main().catch(err => console.log(err));
 
async function main() {
   mongoose.connect("mongodb+srv://<username>:<password>@cluster0.nojyghm.mongodb.net/todolistDB",{useNewUrlParser:true});
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

const listSchema = {
    name:String,
    items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);

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

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                // create a new list
                const list = new List({
                    name:customListName,
                    items:defaultItems
                });
            
                list.save();
                res.redirect("/"+ customListName);
            }else{
                // show an existing list
                res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
            }
        }
    });
});

app.get("/about",function(req,res){
    res.render("about");
});

app.post("/",function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name:itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }

    
});

app.post("/delete",function(req,res){
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if(listName==="Today")
    {
        Item.findByIdAndDelete(checkedItemID,function(err){
            if(err){
                console.log(err);
            }
            res.redirect("/");
        });
    }else
    {
        List.findOneAndUpdate
        (
            {name: listName},
            {$pull:{items:{_id:checkedItemID}}},
            function(err, foundList) {
               if(!err){
                res.redirect("/"+listName);
               } 
            });
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
