const isAdmin = (req, res, next) => {
    if(req.role!== 'admin'){
        return res.status(403).send({success: false, message: 'Nije vam dozvoljeno da izvršite ovu radnju. Molimo prijavite se kao administrator'})
    }
    next ()
}

module.exports = isAdmin;