//主要用于Login登录 register 注册
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");   //加密
const model = require("../../models/getModel");
const util = require("../../config/util");
// const keys = require("../../config/keys");
const gravatar = require('gravatar');  //头像
// const jwt = require("jsonwebtoken");  //token
// const passport = require("passport");

// $route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: "logon users test" })
})

// $route  POST /api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
  // 查询数据库中是否拥有邮箱

  model.findOne('manage', { "account": req.body.account }, function (rs) {
    if (rs.length > 0) {
      return res.status(400).json('手机号已经被注册!');
    } else {

      const newUser = {
        account: req.body.account,
        username: req.body.username,
        status: 0,
        password: util.md5(req.body.password)
      };

      model.insertData('manage', newUser, function (rs) {
        try {
          res.json(rs)
        } catch (error) {
          return res.status(400).json("注册信息失败")
        }

      })
    }
  })


  // User.findOne({ email: req.body.email }).then(user => {

  //     if (user) {
  //         return res.status(400).json( '邮箱已被注册!');
  //     } else {
  //         const avatar = gravatar.url(req.body.email, {
  //             s: '200',
  //             r: 'pg',
  //             d: 'mm'
  //         });

  //         const newUser = new User({
  //             name: req.body.name,
  //             email: req.body.email,
  //             avatar,
  //             password: req.body.password,
  //             identity: req.body.identity
  //         });

  //         bcrypt.genSalt(10, function (err, salt) {
  //             bcrypt.hash(newUser.password, salt, (err, hash) => {
  //                 if (err) throw err;

  //                 newUser.password = hash;

  //                 newUser
  //                     .save()
  //                     .then(user => res.json(user))
  //                     .catch(err => console.log(err));
  //             });
  //         });
  //     }
  // });
});

// $route  POST /api/users/login
// @desc   返回的请求的json数据 token jwt
// @access public

router.post('/login', (req, res) => {

  const phone = req.body.phone;
  const password = req.body.password;
  const pwdkeys = util.md5(password);
  const phonekeys = util.md5(phone + util.secretOrKey);
  //查询数据库
  model.findOne('manage', { "account": phone }, function (rs) {
    if (rs.length > 0) {
      model.findOne('manage', { account: phone, "password": pwdkeys }, function (pwdrs) {
        if (pwdrs.length > 0) {
          res.json({
            success: true,
            token: phonekeys,   //最后返回token值
            avatar: {
              st: pwdrs[0].status,
              name: pwdrs[0].username,
              call: phone
            }
          })
        } else {
          return res.status(400).json("密码错误")
        }
      })
    } else {
      return res.status(404).json("不存在的手机号")
    }
  })


  return false;

  //查询数据库
  User.findOne({ email: req.body.email }).then(user => {
    //判断用户是否存在
    if (!user) {
      return res.status(404).json("用户不存在")
    }
    //密码匹配
    bcrypt.compare(password, user.password).then(isMath => {
      if (isMath) {
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity
        };
        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token: "Bearer " + token   //最后返回token值
          })
        })
      } else {
        return res.status(400).json("密码不存在")
      }
    })
  })
})

// $route  GET /api/users/current
// @desc   返回用户信息
// @access private

// router.get('/current',passport.authenticate('jwt', { session: false }),
//     (req, res) => {
//         res.json({
//             id: req.user.id,
//             name: req.user.name,
//             email: req.user.email,
//             identity: req.user.identity
//         });
//     }
// );

// $route  GET api/staff/findmobile
// @desc   获取单个父级信息
// @access public

router.post('/nologin/:id/:mid', (req, res) => {
  let mid = req.params.mid == 0 ? 1 : 0;
  const sql = `update manage set status=${mid} where id = ${req.params.id}`
  model.findSql(sql, function (rs) {
    try {
      res.json(rs);
    } catch (error) {
      return res.status(400).json("禁用失败")
    }
  })
})


router.get('/usermanagelist', (req, res) => {

  model.findAll("manage", function (rs) {
    try {
      if (rs.length > 0) {
        res.json(rs);
      } else {
        return res.status(400).json("没有一条数据")
      }
    } catch (error) {
      return res.status(400).json("数据不存在")
    }
  })
})

module.exports = router;