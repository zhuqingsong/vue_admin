const express = require("express");
const router = express.Router();
const model = require("../../models/getModel");
var path = require('path'); //系统路径模块
var fs = require('fs'); //文件模块
// 信息列表
// $route  GET api/infolist/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: "成功" })
})

router.get('/courselist', (req, res) => {
  const sql = "select c.*,d.teach_name,d.teach_tel from enter_course_table c left join doctor_teach d on c.course_teach_id = d.ls_id ORDER BY c.course_id"
  model.findSql(sql, function (rs) {
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


router.post('/doctorteach', (req, res) => {

  model.findAll("doctor_teach", function (rs) {
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

// $route  GET api/staff/findmobile
// @desc   获取单个父级信息
// @access public

router.post('/nologin/:id/:courseid', (req, res) => {
  let cst = req.params.courseid == 0 ? 1 : 0;
  const sql = `update enter_course_table set course_st=${cst} where course_id = ${req.params.id}`
  model.findSql(sql, function (rs) {
    try {
      res.json(rs);
    } catch (error) {
      return res.status(400).json("失败")
    }
  })
})

// $route  POST api/staff/add
// @desc   添加数据内容
// @access public

router.post('/add', (req, res) => {
  const courseInformation = {};
  if (req.body.course_name) courseInformation.course_name = req.body.course_name;
  if (req.body.course_price) courseInformation.course_price = req.body.course_price;
  if (req.body.course_teach_id) courseInformation.course_teach_id = req.body.course_teach_id;
  if (req.body.course_cash_scale) courseInformation.course_cash_scale = req.body.course_cash_scale;
  if (req.body.course_discout) courseInformation.course_discout = req.body.course_discout;
  courseInformation.course_st = 1;
  try {
    model.insertData('enter_course_table', courseInformation, function (rs) {
      res.json(rs)
    })
  } catch (error) {
    return res.status(400).json("课程信息添加错误")
  }
})



module.exports = router;