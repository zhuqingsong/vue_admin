<template>
  <div class="staff">
    <div class="staff-top">
      <el-form :inline="true" :model="formInSearch" class="demo-form-inline">
        <el-form-item label="学员报名课程查询" prop="stu_phone">
          <el-input v-model="formInSearch.stu_phone" placeholder="学员手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="tables">
      <el-table :data="userData" border style="width: 100%">
        <el-table-column label="编号" align="center" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.course_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程缴费" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.hand_st | formatST }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程价格" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.course_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程成交价格" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.hand_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名学员" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.stu_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学员手机号" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.stu_phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.hand_st==0"
              @click="handleEdit(scope.$index, scope.row)"
            >设置已缴费</el-button>
            <el-button size="mini" type="success" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginations.page_index"
        :page-sizes="paginations.page_sizes"
        :page-size="paginations.page_size"
        :layout="paginations.layout"
        :total="paginations.total"
      ></el-pagination>
    </div>
    <PayDialog :dialog="dialog" :form="form" @UserData="userInfo"></PayDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import PayDialog from "../components/PayDialog";
export default {
  name: "bmList",
  filters: {
    formatST(ST) {
      return ST == 1 ? "已缴费" : "未缴费";
    }
  },
  data() {
    return {
      formInSearch: {
        stu_phone: ""
      },
      userData: [], //数据存储
      allTableData: [],
      paginations: {
        page_index: 1, //当前页
        total: 0, //总数
        page_size: 5, //一页显示多少
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper"
      },
      dialog: {
        title: "缴费",
        show: false,
        option: "edit"
      },
      form: {
        price: "",
        id: ""
      }
    };
  },
  methods: {
    onSubmitSearch() {
      if (this.formInSearch.stu_phone == "") {
        this.userInfo();
      } else {
        this.$axios
          .post("/api/staff/searchkc", this.formInSearch)
          .then(res => {
            console.log(res);
            this.allTableData = res.data;
            // console.log(this.tableData)
            this.setPaginations();
          })
          .catch(err => console.log(err));
      }
    },
    userInfo() {
      this.$axios
        .get("/api/staff/getLPayCourse")
        .then(res => {
          console.log(res);
          this.allTableData = res.data;
          // console.log(this.tableData)
          this.setPaginations();
        })
        .catch(err => console.log(err));
    },
    handleEdit(index, row) {
      this.dialog = {
        title: "缴费",
        show: true,
        option: "add"
      };
      this.form.id = row.id;
    },
    handleDelete(index, row) {
      //删除数据
      let that = this;
      this.$confirm("此操作将永久删除该学员课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`/api/staff/deletekc/${row.id}`).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          that.userInfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1; //第一页
      this.paginations.page_size = page_size; //每页先显示多少数据
      this.userData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      this.paginations.total = this.allTableData.length; //数据的数量
      this.paginations.page_index = 1; //默认显示第一页
      this.paginations.page_size = 5; //每页显示多少数据

      //显示数据
      this.userData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleCurrentChange(page) {
      // 跳转页数
      //获取当前页
      let index = this.paginations.page_size * (page - 1);
      //获取总数
      let allData = this.paginations.page_size * page;

      let tablist = [];
      for (let i = index; i < allData; i++) {
        if (this.allTableData[i]) {
          tablist.push(this.allTableData[i]);
        }
        this.userData = tablist;
      }
    }
  },
  created() {
    this.userInfo();
  },
  components: {
    PayDialog
  }
};
</script>
<style scoped>
.staff {
  margin: 10px;
}
.btnRight {
  float: right;
}
.page {
  margin-top: 10px;
  text-align: right;
}
</style>
