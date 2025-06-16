const express = require('express');
const Comment  = require('../model//comment.mode')
const router = express.Router();

// Kreiranje novog komentara
router.post('/post-comment', async(req, res) => {
    try {
        console.log(req.body);
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(200).send({message: "Komentar je uspješno kreiran", comment: newComment})
    } catch (error) {
        console.log("An error occurred while posting new comment", error);
        res.status(500).send({message: "Došlo je do greške prilikom objavljivanja novog komentara"})
    }
})

// Dohvacanje svih komentara
router.get("/total-comments", async(req, res) => {
    try{
        const totalComment = await Comment.countDocuments({});
        res.status(200).send({message: "Ukupan broj komentara", totalComment})
    } catch (error) {
        console.log("An error occurred while geting comment count", error);
        res.status(500).send({message: "Došlo je do greške prilikom dohvaćanja broja komentara"})
    }
})

module.exports = router;
