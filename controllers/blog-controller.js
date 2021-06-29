const mongoose = require("mongoose");


const Blog = require("../models/blog");

const HttpError = require("../utils/http-error");

// Post Blog----------------------------------------------------------------
const postBlog = async (req, res, next) => {

    // console.log(req.body);      
                                                  
   const { heading, blog, userID} = req.body;

   // Existing Blog
//    console.log(heading);
//    console.log(blog);
//    console.log(userID);
   
   let existingBlog;
   try {
     existingBlog = await Blog.findOne({
       heading: heading,
     });
   } catch (err) {
     console.log(err);
     const error = new HttpError("Upload Blog failed, please try later", 700);
     return next(error);
   }
   if (existingBlog) {
     const error = new HttpError("Heading already in use", 701);
     return next(error);
   }

   // Blog Creation
   const createdBlog = new Blog({
    heading: heading,
    blog: blog,
    userID: userID,
   });
 
  
   try {

     await createdBlog.save();
    
   } catch (err) {
     console.log(err);
     const error = new HttpError("Blog Creation failed", 702);
     return next(error);
   }
 
   return res.json({heading: createdBlog.heading, blog: createdBlog.blog, userID: createdBlog.userID,});
 };

 // Get Blog----------------------------------------------------------------
 const getBlog = async (req, res, next) => {

    const {userID} = req.body;

    let existingBlog;
    try {
      existingBlog = await Blog.findOne({
        userID: userID,
      });

      
    } catch (err) {
      const error = new HttpError("Get Blog failed, Please try later", 703);
      return next(error);
    }
  
    if (!existingBlog) {
      const error = new HttpError("Invalid Credentials, Please try later", 704);
      return next(error);
    }

    return res.json({heading: existingBlog.heading, blog: existingBlog.blog, userID: existingBlog.userID,});
      
};
  

   exports.postBlog = postBlog;
   exports.getBlog = getBlog;