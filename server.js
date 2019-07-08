const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
// const passport = require("passport"); //验证token
//引入users.js
const users = require('./routes/api/users');
//引入profiles.js
const profiles = require("./routes/api/profiles");
//staff.js
const staff = require("./routes/api/staff");
// infolist.js
const customlist = require("./routes/api/infolist");

const managelist = require("./routes/api/custom");
// 课程管理
const course = require("./routes/api/course");

const ejs = require('ejs');


app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// 引入DB config
// const db = require('./config/keys').mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/assets', express.static('assets'));
// //链接MongoDB
// mongoose
// 	.connect(
// 		db,
// 		{ useNewUrlParser: true }
// 	)
// 	.then(() => {
// 		console.log('MongoDB Connected链接成功');
// 	})
// 	.catch(err => console.log(err));

//引入passport初始化
// app.use(passport.initialize());
// require("./config/passport")(passport);

// 使用routes
app.use('/api/users', users);
app.use("/api/profiles", profiles);
app.use("/api/staff", staff);
app.use("/api/customlist", customlist);
app.use("/api/managelist", managelist);
app.use("/api/course", course);

const port = process.env.PORT || 5000; //地址

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.get('/', (req, res) => {
  res.render('index');
});