//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require ("mongoose");
const _=require("lodash");
mongoose.connect("mongodb+srv://asimanand:asim@cluster0.pcczq.mongodb.net/todolistDB",{ useNewUrlParser: true });
const itemschema=new mongoose.Schema({
  name:String
});
const item=mongoose.model("item",itemschema);

const item1=new item({
  name:"Buy food"
});
const item2=new item({
  name:"cook food"
});
const item3=new item({
  name:"eat food"
});

const defaultitem=[];
const listschema=new mongoose.Schema({
  name:String,
  items:[itemschema]
});
const list=mongoose.model("list",listschema);
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res) {
  item.find(function(err,items){
    if(err){
      console.log(err);
    }
    else{
      if(items.length===0){
        // item.insertMany(defaultitem,function(err){
        //   if(err){
        //     console.log(err);
        //   }
        //   else{
        //     console.log("success");
        //   }
        // })
        // res.redirect("/");
        res.render("list",{listTitle: "Today",newListItems: items})
      }
      else{
      res.render("list", {listTitle: "Today", newListItems: items});}
    }




})
});

app.post("/", function(req, res){

  const itemname = req.body.newItem;
  const listname=req.body.list;

  const Items=new item({
    name:itemname
  })
  if(listname==="Today"){
  Items.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
}
  else{
    list.findOne({name: listname},function(err,result){
      result.items.push(Items);
      result.save(function(err){
        if(!err){
          res.redirect("/"+listname);
        }
      });

    })
  }
});
app.post("/delete",function(req,res){
  if(req.body.listname==="Today"){
  item.deleteOne({_id:req.body.check},function(err){
    if(err){
    console.log(err);
  }
  else{
    console.log("succesfully inserted");
  }
  })
  res.redirect("/");}
  else{
    list.findOneAndUpdate({name:req.body.listname},{$pull:{items:{_id:req.body.check}}},function(err,result){
      if(!err){
        res.redirect("/"+req.body.listname);
      }
    })
    }
  }
)
app.get("/:parametername",function(req,res){
  list.findOne({name:_.capitalize(req.params.parametername)},function(err,results){
    if(!err){
      if(!results){
        const lists=new list({
          name:_.capitalize(req.params.parametername),
          items:defaultitem
        })
        lists.save();
        res.redirect("/"+_.capitalize(req.params.parametername));
      }
      else{
          res.render("list", {listTitle: _.capitalize(req.params.parametername), newListItems: results.items});
      }
    }
  })

})

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started");
});
