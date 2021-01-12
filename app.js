//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost:27017/WikiDB', {useNewUrlParser: true, useUnifiedTopology: true});


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
const articalSchema = {
  title:String,
  content: String
};

const Artical = mongoose.model("Artical", articalSchema);

app.get("/articales",function(req,res){
Artical.find(function(err,foundArticales){
  if(!err) {
  res.send(foundArticales);
} else  {
    res.send(err);
  }
});
});

app.post("/articales",function(req,res){

const new_Artical = new Artical({
  title:req.body.title,
  content:req.body.content
});
new_Artical.save(function(err){
  if (!err) {
    res.send("Successfully Received");
  }
  else{
    res.send(err);
  }

});

});

app.delete("/articales", function(req,res){
  Artical.deleteMany(function(err){
    if (!err) {
      res.send("Successfully Deleted");
    }
    else{
      res.send(err);
    }
  });
});
////////////////////////////////////////////////////////////////////
app.route("/articales/:articaleTitle")
.get(function(req,res){
  Artical.findOne({title:req.params.articaleTitle},function(err,foundArticale){
if(foundArticale){
  res.send(foundArticale);
}
else{
  res.send("No Match");
}

});
})
.put(function(req,res){
Artical.update(
  {title: req.params.articaleTitle},
  {title: req.body.title, content:req.body.content},
  {overwrite:true},
  function(err){
    if(!err) {
      res.send("Sucessfully updates article");
    }
  });
})
.patch(function(req,res){
Artical.update(
  {title: req.params.articaleTitle},
  {$set: req.body},
  function(err){
    if(!err){
      res.send("Sucessful");
    }
    else{
      res.send("Unsucessfull");
    }
  });

})
.delete(function(req,res){
  Artical.deleteOne({title:req.params.articaleTitle},function(err){
    if (!err) {
      res.send("Successfully Deleted");
    }
    else{
      res.send("Unsucessfull");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
