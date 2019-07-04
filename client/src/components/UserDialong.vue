<template>
  <div class="nofind">
    <el-dialog
      :title="dialong.title"
      type="primary"
      size="small"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="dialong.show"
    >
      <el-form :model="form" ref="formdoalog" :rules="formdialog" label-width="110px">
        <el-form-item label="用户昵称" prop="stu_name">
          <el-input v-model="form.stu_name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="stu_phone">
          <el-input v-model="form.stu_phone"></el-input>
        </el-form-item>
        <el-form-item label="代理人手机号">
          <el-input v-model="form.parent_mobile" class="wd"></el-input>
          <el-button type="primary"  @click="serachParent(form.parent_mobile)" icon="el-icon-search round" class="ml10">查询</el-button>
        </el-form-item>
         <el-form-item label="" v-show="addview">
          <el-tag>{{ parent_name }}</el-tag>
         </el-form-item>
          <el-form-item label="学习课程" prop="course_id">
            <el-checkbox-group v-model="form.course_id">
              <el-checkbox :label="item.course_id" v-for="item in kc_data"  name="course_id" :key="item.course_id">{{ item.course_name }}</el-checkbox>
            </el-checkbox-group>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialong.show = false">取 消</el-button>
        <el-button type="primary" @click="addHandle()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "UserDialong",
  data() {
    
  let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
	let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('号码不能为空!!'))
      }
      setTimeout(() => {
        if (!phoneReg.test(value)) {
          callback(new Error('格式有误'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      parent_name : "",
      kc_data : [],
      addview : false,
      formdialog: {
        stu_name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        stu_phone: [{ required: true,validator: validatePhone, trigger: 'blur' }],
        course_id: [
            { type: 'array', required: true, message: '请至少选择一个课程', trigger: 'change' }
        ]
      }
    };
  },
  props: {
    dialong: Object,
    form: Object
  },
  created() {
     this.init_course();
  },
  methods: {
    init_course(){
        this.$axios.post(`/api/staff/getCourseList`).then(res => { 
            this.kc_data = res.data;
        })
    },
    serachParent(parentPhone) {
      if(parentPhone==''){
        return fasle;
      }
     this.$axios.post(`/api/staff/findmoblie`,this.form).then(res => { 
          console.log(res)
          const { pmobile, pname, id } = res.data;
          if(pname){
            this.parent_name = pname;
            this.addview = true;
            this.form.parent_id = id;
          }else{
            this.parent_name = "";
            this.form.parent_id  = 0;
            this.addview = false;
             this.$message({
                type: "info",
                message: "不存在的手机号"
            });
          }
          
     })
    }, 
    addHandle() {
      this.$refs['formdoalog'].validate(valid => {
        if (valid) {
          let url =
            this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;
          this.$axios.post(`/api/staff/${url}`, this.form).then(res => {
            this.$message({
              type: "success",
              message: "数据添加成功"
            })
              this.dialong.show = false;
              this.$emit("UserData");
            //清空内容
             // this.form = "";
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
  .wd{
    width:80%;
  }
  .ml10{
    margin-left:10px;
  }
</style>
