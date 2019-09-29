const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Item = require("../models/item");

router.post("",checkAuth,(req, res, next) => {
const item = new Item ({
  content: req.body.content,
  creator:req.userData.userId
});
item.save().
then(createnItem =>{
  res.status(201).json({
        message: "item added successfully",
        item: {
         id: createnItem._id,
         content: createnItem.content,
         creator:req.userData.userId
        }
  });
}).catch(error => {
  res.status(500).json({
    message: "Creating a post Faild"
  });
});
});

router.get("",checkAuth,(req,res,next) =>{
  Item.find({creator: req.userData.userId}).then(documents =>{
    res.status(200).json({
      message: "items fetched succesfully!",
      items: documents
    });
  }).catch(error => {
    res.status(500).json({
      message: "Fetching items Faild"
    });
  });

});

router.delete("/:id",checkAuth,(req,res,next) =>{
  Item.deleteOne({_id:req.params.id, creator: req.userData.userId}).then(result =>{
    res.status(200).json({ message: "deletion success" });
  }).catch(error => {
    res.status(500).json({
      message: "Deleting Post Faild"
    });
  });
});
module.exports = router;
