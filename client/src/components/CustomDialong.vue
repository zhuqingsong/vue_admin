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
        <el-form-item label="昵称" prop="cust_name">
          <el-input v-model="form.cust_name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="cust_phone">
          <el-input v-model="form.cust_phone"></el-input>
        </el-form-item>
        <el-form-item label="客服QQ" prop="cust_qq">
          <el-input v-model="form.cust_qq"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="cust_sex">
          <el-radio v-model="form.cust_sex" label="0">女</el-radio>
          <el-radio v-model="form.cust_sex" label="1">男</el-radio>
        </el-form-item>
        <el-form-item label="微信号" prop="cust_wx">
          <el-input v-model="form.cust_wx"></el-input>
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
  name: "CustomDialong",
  data() {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("号码不能为空!!"));
      }
      if (!phoneReg.test(value)) {
        callback(new Error("格式有误"));
      } else {
        callback();
      }
    };
    return {
      radio: "0",
      formdialog: {
        cust_name: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        cust_phone: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        cust_qq: [
          { required: true, message: "qq也不能为空哦", trigger: "blur" }
        ],
        cust_wx: [
          { required: true, message: "微信号也不能为空哦", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    dialong: Object,
    form: Object
  },
  created() {},
  methods: {
    addHandle() {
      this.$refs["formdoalog"].validate(valid => {
        if (valid) {
          let url =
            this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;
          this.$axios.post(`/api/managelist/${url}`, this.form).then(res => {
            this.$message({
              type: "success",
              message: "客服人员添加成功"
            });
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
.wd {
  width: 80%;
}
.ml10 {
  margin-left: 10px;
}
</style>
