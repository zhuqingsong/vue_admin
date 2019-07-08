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

router.get('/userlist', (req, res) => {

  const sql = "select p.*,c.cust_name,c.cust_wx from enter_parent_table p left join enter_custom_table c on p.parent_custom_id = c.id ORDER BY p.id"
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

// $route  GET api/staff/findmobile
// @desc   获取单个父级信息
// @access public

router.post('/findcustom', (req, res) => {
  console.log(req.body.parent_custom_mobile)
  let cmobile = "";
  if (req.body.parent_custom_mobile) {
    cmobile = req.body.parent_custom_mobile
  } else {
    return res.status(400).json("你查询的手机号不存在");
  };
  console.log(cmobile)
  model.findOne("enter_custom_table", { "cust_phone": cmobile }, function (rs) {
    console.log(rs)
    if (rs.length > 0) {
      res.json(rs[0]);
    } else {
      res.json({ "pname": false });
    }
  })


})

// $route  POST api/staff/add
// @desc   添加数据内容
// @access public

router.post('/add', (req, res) => {
  const custInformation = {};
  if (req.body.pname) custInformation.pname = req.body.pname;
  if (req.body.pmobile) custInformation.pmobile = req.body.pmobile;
  if (req.body.bank_card) custInformation.bank_card = req.body.bank_card;
  if (req.body.bank_city) custInformation.bank_city = req.body.bank_city;
  if (req.body.bank_name) custInformation.bank_name = req.body.bank_name;
  if (req.body.bank_branch_name) custInformation.bank_branch_name = req.body.bank_branch_name;
  if (req.body.parent_custom_id) custInformation.parent_custom_id = req.body.parent_custom_id;
  custInformation.cash_back_price = 0;
  custInformation.total_cash_back = 0;
  custInformation.parent_join_time = new Date();
  try {
    model.insertData('enter_parent_table', custInformation, function (rs) {
      res.json(rs)
    })
  } catch (error) {
    return res.status(400).json("学员信息添加错误")
  }
})



module.exports = router;