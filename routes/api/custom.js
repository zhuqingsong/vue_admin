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

router.get('/customlist', (req, res) => {

  model.findAll("enter_custom_table", function (rs) {
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

router.post('/nologin/:id/:custid', (req, res) => {
  let cst = req.params.custid == 0 ? 1 : 0;
  const sql = `update enter_custom_table set cust_st=${cst} where id = ${req.params.id}`
  model.findSql(sql, function (rs) {
    try {
      res.json(rs);
    } catch (error) {
      return res.status(400).json("禁用失败")
    }
  })
})

// $route  POST api/staff/add
// @desc   添加数据内容
// @access public

router.post('/add', (req, res) => {
  const custInformation = {};
  if (req.body.cust_name) custInformation.cust_name = req.body.cust_name;
  if (req.body.cust_phone) custInformation.cust_phone = req.body.cust_phone;
  if (req.body.cust_qq) custInformation.cust_qq = req.body.cust_qq;
  if (req.body.cust_sex) custInformation.cust_sex = req.body.cust_sex;
  if (req.body.cust_wx) custInformation.cust_wx = req.body.cust_wx;
  custInformation.cust_st = 1;
  custInformation.cust_join_time = new Date();
  try {
    model.insertData('enter_custom_table', custInformation, function (rs) {
      res.json(rs)
    })
  } catch (error) {
    return res.status(400).json("客服信息添加错误")
  }
})



module.exports = router;