const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");

const app = express();

const items = ["Buy Food","Cook Food","Eat Food"];
const workItems = [];

app.set('view engine','ejs');  // tell app to use ejs as its view engine
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));  // css styles will be applied


app.get("/",function(req,res){    // '/' is for the home route
    // In case I wanna write multiple lines
    // res.write('<h1>What is up, my G?</h1>');
    // res.write('<p>Sending with HTML<p>');
    // res.send();

    // with ejs use render which uses view engine
    let day = date.getDate();
    res.render('list',{listTitle: day,newListItems:items});    
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
