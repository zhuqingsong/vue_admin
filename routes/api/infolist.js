const express = require("express");
const router = express.Router();
const model = require("../../models/getModel");
var path = require('path'); //系统路径模块
var fs = require('fs'); //文件模块
// 信息列表
// $route  GET api/infolist/test
// @desc   返回的请求的json数据
// @access public
router.get('/test',(req,res) => {
	res.json({msg:"成功"})
})

router.get('/userlist',(req,res) => {

	const sql = "select p.*,c.cust_name,c.cust_wx from enter_parent_table p left join enter_custom_table c on p.parent_custom_id = c.id ORDER BY p.id"
	model.findSql(sql,function(rs){
		try {
				if(rs.length > 0 ){
					res.json(rs);
				}else{
					return res.status(400).json("没有一条数据")
				}
		} catch (error) {
			 return res.status(400).json("数据不存在")
		}
	})		
})


module.exports = router;