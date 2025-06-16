const path = require('path');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

// parse options
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
const blogRoutes = require("./src/routes/blog.route");
const commentRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route");

app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", userRoutes);


async function main() {
    await mongoose.connect(process.env.MONGODB_URL);

    //b3rpHmkf84RPkCGu
    //kvrgicaida95
  
    app.get('/', (req, res) => {
        res.send('Inn-Tech blog server is running...!')
      })

}

main().then(() => console.log("Mongodb connected seccessfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})