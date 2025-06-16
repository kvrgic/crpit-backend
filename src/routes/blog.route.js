const express = require('express');
const Blog = require('../model/blog.model');
const Comment = require('../model/comment.mode');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// Kreiranje nove objave
router.post("/create-post", verifyToken, isAdmin, async(req, res) =>{
    try{
        //console.log("Blog data from api: ",req.body)
        const newPost = new Blog({...req.body, author: req.userId});
        await newPost.save();
        res.status(201).send({
            message: "Objava je uspješno kreirana",
            post: newPost
        })
    } catch(error){
        console.error("Error creating post: ", error);
        res.status(500).send({message: "Greška pri kreiranju objave"})
    }
})

// Dohvacanje svih objava
router.get('/', async (req, res)=>{
    try{
        const {search, category, location} = req.query;
        console.log(search);

        let query = {}

        if(search){
            query ={
                ...query,
                $or: [
                    {title: {$regex: search, $options: "i"}},
                    {content: {$regex: search, $options: "i"}}
                ]
            }
        }
        if(category){
            query ={
                ...query,
                category
            }
        } 
        if(location){
            query ={
                ...query,
                location
            }
        } 
        const posts = await Blog.find(query).populate('author', 'email').sort({createdAt: -1});
        res.status(200).send(posts)
    } catch(error){
        console.error("Error creating post: ", error);
        res.status(500).send({message: "Greška pri kreiranju objave"})
    }
})

// Dohvacanje jednog bloga preko njegovog id-a
router.get("/:id", async(req, res) =>{
    try{
        //console.log(req.params.id)
        const postId = req.params.id
        const post = await Blog.findById(postId);
        if(!post){
            return res.status(404).send({message:"Objava nije pronađena!"})
        }
        const comments = await Comment.find({postId: postId}).populate('user', "username email")
        res.status(200).send({
            post, comments
        })
    } catch(error){
        console.error("Error fetching single post: ", error);
            res.status(500).send({message: "Greška pri dohvaćanju objave"})
    }
})

// Ažuriranje objave
router.patch("/update-post/:id" , verifyToken, isAdmin, async(req, res) =>{
    try{
        const postId = req.params.id;
        const updatedPost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        }, {new:true});

        if(!updatedPost){
            return res.status(404).send({message: "Objava nije pronađena!"})
        }
        res.status(200).send({
            message: "Objava je uspješno ažurirana",
            post: updatedPost
        })
    } catch(error){
        console.error("Error updating post: ", error);
        res.status(500).send({message: "Greška pri ažuriranju objave"})
    }
})

// Brisanje objave
router.delete("/:id",verifyToken, isAdmin, async(req,res) => {
    try{
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId)
        if(!post){
            return res.status(404).send({message: "Objava nije pronađena!"})
        }
        // Brisanje komentara (za tu objavu)
        await Comment.deleteMany({postId: postId})
        res.status(200).send({
            message: "Objava je uspješno izbrisan",
            post: post
        })
    } catch(error){
        console.error("Error deleting post: ", error);
        res.status(500).send({message: "Greška prilikom brisanja objave"})
    }
})

// Povezani blogovi
router.get("/related/:id", async(req,res) => {
    try{
        const {id} = req.params;
        if(!id) {
            return res.status(404).send({message: "ID objave je obavezan"})
        }
        const blog = await Blog.findById(id);
        if(!blog) {
            return res.status(404).send({message: "Objava nije pronađena!"})
        }
        const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');

        const relatedQuery = {
            _id: {$ne: id}, 
            title: {$regex: titleRegex}
        }
        
        const relatedPost = await Blog.find(relatedQuery)
        res.status(200).send(relatedPost)

    } catch(error){
        console.error("Error fatching related post: ", error);
        res.status(500).send({message: "Greška pri dohvaćanju srodnih objava"})
    }
})

module.exports = router