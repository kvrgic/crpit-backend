const express = require('express');
const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');
const { CURSOR_FLAGS } = require('mongodb');
const { registerValidation } = require('../middleware/validators/userValidator');
const validate = require('../middleware/validators/validate');

const router = express.Router();

// Registracija novog korisnika
router.post('/register',registerValidation, validate, async(req, res) => {
    try{
        const {email, password, username} = req.body;
        const user = new User({email, password, username});
        //console.log(user)
        await user.save();
        res.status(200).send({message: "Korisnik je uspješno registriran!", user: user});

    } catch(error){
        console.log("Failed to register", error);
        res.status(500).json({message: 'Registracija nije uspjela!'});
    }
})

// Prijava korisnika
router.post("/login", async (req, res) => {
    try{
        //console.log(req.body);
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).send({message: 'Korisnik nije pronađen!'})
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            return res.status(401).send({message: 'Neispravna lozinka!'})
        }

        // Generisanje tokena
        const token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true, // Omogući ovo samo ako aplikacija koristi HTTPS://
            secure: true,
            sameSite: 'Lax'
        })

        res.status(200).send({message: 'Prijava je uspješna!', token, user:{
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        }})

    } catch (error) {
        console.log("Failed to login", error);
        res.status(500).json({message: 'Prijava nije uspjela! Pokušajte ponovo.' });
    }
})

// Odjava korisnika
router.post("/logout", async(req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({message: 'Odjava je uspješno izvršena!' });
        
    } catch (error) {
        console.error("Failed to logout", error);
        res.status(500).json({message: 'Odjava nije uspjela!' });
    }
})

// Dohvacanje korisnika
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role');
        res.status(200).send({message: "Korisnici su uspješno pronađeni", users})
        
    } catch (error) {
        console.error("Error fetching users", error);
        res.status(500).json({message: 'Neuspješno dohvaćanje korisnika!' });
    }
})

// Brisanje korisnika
router.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOneAndDelete(id);

        if(!user) {
            return res.status(400).send({message: 'Korisnik nije pronađen!'});
        }

        res.status(200).send({message: "Korisnik je uspješno obrisan!"})
        
    } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).json({message: 'Greška pri brisanju korisnika!' });
    }
})

// Ažuriranje uloge/role korisnika
router.put('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id, {role}, {new: true});

        if(!user) {
            return res.status(404).send({message: 'Korisnik nije pronađen!'})
        }

        res.status(200).send({message: 'Uloga korisnika je uspješno ažurirana!', user})
        
    } catch (error) {
        console.error("Error updating user role", error);
        res.status(500).json({message: 'Greška pri ažuriranju uloge korisnika!' });
    }
})

module.exports = router;