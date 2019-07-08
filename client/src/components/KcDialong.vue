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
        <el-form-item label="课程名称" prop="course_name">
          <el-input v-model="form.course_name"></el-input>
        </el-form-item>
        <el-form-item label="课程价格" prop="course_price">
          <el-input v-model="form.course_price"></el-input>
        </el-form-item>
        <el-form-item label="课程老师" prop="course_teach_id">
          <el-radio
            v-model="form.course_teach_id"
            v-for="item in teacher_data"
            :key="item.ls_id"
            :label="item.ls_id"
          >{{ item.teach_name }}</el-radio>
        </el-form-item>
        <el-form-item label="课程返现比例" prop="course_cash_scale">
          <el-input v-model="form.course_cash_scale"></el-input>
        </el-form-item>
        <el-form-item label="课程折扣" prop="course_discout">
          <el-input v-model="form.course_discout"></el-input>
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
  name: "KcDialong",
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
      teacher_data: [],
      formdialog: {
        course_name: [
          { required: true, message: "课程名字不能为空", trigger: "blur" }
        ],
        course_price: [
          { required: true, message: "课程价格不能为空", trigger: "blur" }
        ],
        course_cash_scale: [
          { required: true, message: "课程返现不能为空", trigger: "blur" }
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
    init_course() {
      this.$axios.post(`/api/course/doctorteach`).then(res => {
        this.teacher_data = res.data;
      });
    },
    addHandle() {
      this.$refs["formdoalog"].validate(valid => {
        if (valid) {
          if (this.form.course_teach_id == "") {
            this.$message({
              type: "error",
              message: "选中一个老师吧"
            });
            return false;
          }
          let url =
            this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;
          this.$axios.post(`/api/course/${url}`, this.form).then(res => {
            this.$message({
              type: "success",
              message: "课程添加成功"
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
