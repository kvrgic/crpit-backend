const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS dolazi odmah iza express() i PRIJE svih drugih middleware-a
const allowedOrigin = "https://crpit-frontend.vercel.app";
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// ✅ Middleware redoslijed
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ✅ Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Rute
const blogRoutes = require("./src/routes/blog.route");
const commentRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route");

app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", userRoutes);

app.get('/', (req, res) => {
  res.send('Inn-Tech blog server is running...!');
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Ruta nije pronađena." });
});

// ✅ DB konekcija
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Mongodb connected successfully!");
}
main().catch(err => console.log(err));

// ✅ Pokretanje servera
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
