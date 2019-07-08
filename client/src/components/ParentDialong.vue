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
        <el-form-item label="昵称" prop="pname">
          <el-input v-model="form.pname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="pmobile">
          <el-input v-model="form.pmobile"></el-input>
        </el-form-item>
        <el-form-item label="客服手机号">
          <el-input v-model="form.parent_custom_mobile" class="wd"></el-input>
          <el-button
            type="primary"
            @click="serachParent()"
            icon="el-icon-search round"
            class="ml10"
          >查询</el-button>
        </el-form-item>
        <el-form-item label v-show="dialong.addview">
          <el-tag>{{ cust_name }}</el-tag>
        </el-form-item>
        <el-form-item label="开户行卡号" prop="bank_card">
          <el-input v-model="form.bank_card"></el-input>
        </el-form-item>
        <el-form-item label="开户城市" prop="bank_city">
          <el-input v-model="form.bank_city"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bank_name">
          <el-input v-model="form.bank_name"></el-input>
        </el-form-item>
        <el-form-item label="开户支行" prop="bank_branch_name">
          <el-input v-model="form.bank_branch_name"></el-input>
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
      cust_name: "",
      kc_data: [],
      formdialog: {
        pname: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        pmobile: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        bank_card: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        bank_city: [
          { required: true, message: "开户城市不能为空", trigger: "blur" }
        ],
        bank_name: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ],
        bank_branch_name: [
          { required: true, message: "开户支行不能为空", trigger: "blur" }
        ],
        parent_custom_id: [
          { required: true, message: "必须有对接客服", trigger: "blur" }
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
    init_course() {
      this.$axios.post(`/api/staff/getCourseList`).then(res => {
        this.kc_data = res.data;
      });
    },
    serachParent() {
      if (this.form.parent_custom_mobile == "") {
        this.$message({
          type: "success",
          message: "必须要填写客服手机号哟！"
        });
        return fasle;
      }
      this.$axios.post(`/api/customlist/findcustom`, this.form).then(res => {
        console.log(res);
        const { cust_name, cust_phone, id, cust_st } = res.data;
        if (cust_st == 0) {
          this.$message({
            type: "error",
            message: "你选择的客服已经禁用"
          });
          return false;
        }
        if (cust_name) {
          this.cust_name = cust_name;
          this.dialong.addview = true;
          this.form.parent_custom_id = id;
        } else {
          this.cust_name = "";
          this.form.parent_custom_id = 0;
          this.dialong.addview = false;
          this.$message({
            type: "info",
            message: "不存在的手机号"
          });
        }
      });
    },
    addHandle() {
      this.$refs["formdoalog"].validate(valid => {
        if (valid) {
          if (this.form.parent_custom_id == "") {
            this.$message({
              type: "error",
              message: "必须绑定一个维护客服"
            });
            return false;
          }
          let url =
            this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;
          this.$axios.post(`/api/customlist/${url}`, this.form).then(res => {
            this.$message({
              type: "success",
              message: "代理人添加成功"
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
  width: 70%;
}
.ml10 {
  margin-left: 10px;
}
</style>
