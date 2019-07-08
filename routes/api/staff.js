//主要用于Login登录 register 注册
const express = require("express");
const router = express.Router();
const model = require("../../models/getModel");
const passport = require("passport");
const async = require("async");

// $route  GET api/staff/test
// @desc   返回的请求的json数据
// @access public
router.get("/text", (req, res) => {
  res.json({ msg: "staff" });
});


// $route  POST api/staff/add
// @desc   添加数据内容
// @access public

router.post('/add', (req, res) => {
  const staffInformation = {}, idArr = req.body.course_id;
  if (req.body.stu_name) staffInformation.stu_name = req.body.stu_name;
  if (req.body.stu_phone) staffInformation.stu_phone = req.body.stu_phone;
  staffInformation.stu_st = 0;
  staffInformation.role_id = 1;
  if (req.body.parent_id) staffInformation.parent_id = req.body.parent_id;
  if (idArr) staffInformation.course_id = idArr.join('-');
  staffInformation.date_current = new Date();
  try {
    model.insertData('enter_stu_table', staffInformation, function (rs) {
      res.json(rs)
    })
  } catch (error) {
    return res.status(400).json("学员信息添加错误")
  }
})

// $route  GET api/staff
// @desc   获取所有的数据
// @access public
router.get('/', (req, res) => {
  const sql = "select c.*,r.role_msg,p.pname from enter_stu_table c left join enter_role_table r on c.role_id = r.role_id left join enter_parent_table p on c.parent_id = p.id ORDER BY c.id"
  model.findSql(sql, function (rs) {
    try {
      if (rs.length > 0) {
        res.json(rs)
      } else {
        return res.status(400).json("没有任何数据存在")
      }
    } catch (error) {
      return res.status(404).json(error)
    }
  })
});


// $route  GET api/staff/findmobile
// @desc   获取单个父级信息
// @access public

router.post('/findmoblie', (req, res) => {
  let parent_mobile = "";
  if (req.body.parent_mobile) {
    parent_mobile = req.body.parent_mobile
  } else {
    return res.status(400).json("你查询的手机号不存在");
  };
  console.log(parent_mobile)
  model.findOne("enter_parent_table", { "pmobile": parent_mobile }, function (rs) {
    if (rs.length > 0) {
      res.json(rs[0]);
    } else {
      res.json({ "pname": false });
    }
  })
})

// $route  GET api/staff/getCourseList
// @desc   获取单个数据源数据内容
// @access public
router.post('/getCourseList', (req, res) => {
  const sql = "select * from enter_course_table where course_st !=0"
  model.findSql(sql, function (rs) {
    try {
      if (rs.length > 0) {
        res.json(rs);
      } else {
        return res.status(400).json("数据不存在")
      }
    } catch (error) {
      return res.status(400).json("数据不存在")
    }
  })
})


// $route  GET api/staff/:id
// @desc   获取单个数据源数据内容
// @access public

router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Staff.findOne({ _id: req.params.id }).then(staff => {
    if (!staff) {
      return res.status(400).json("数据不存在")
    }
    res.json(staff)
  }).catch(err => {
    return res.status(404).json(err)
  })
});


// $route  POST api/staff/edit/:id
// @desc   编辑个人信息
// @access public

router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {

  const staffInformation = {};
  if (req.body.name) staffInformation.name = req.body.name;
  if (req.body.sex) staffInformation.sex = req.body.sex;
  if (req.body.state) staffInformation.state = req.body.state;
  if (req.body.hobby) staffInformation.hobby = req.body.hobby;
  if (req.body.marriage) staffInformation.marriage = req.body.marriage;
  if (req.body.birthday) staffInformation.birthday = req.body.birthday;
  if (req.body.address) staffInformation.address = req.body.address;

  //更新数据内容
  Staff.findByIdAndUpdate({ _id: req.params.id }, { $set: staffInformation }, { new: true })
    .then(staff => {
      if (!staff) {
        return res.status(400).json("数据不存在");
      }
      res.json(staff);
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});


// $route  POST api/staff/delete/:id
// @desc   删除单个信息
// @access public

router.delete("/delete/:id", (req, res) => {
  const sql = `delete from enter_stu_table where id = ${req.params.id}`
  model.findSql(sql, function (rs) {
    try {
      res.json(rs);
    } catch (error) {
      return res.status(400).json("删除失败")
    }
  })
});



module.exports = router;