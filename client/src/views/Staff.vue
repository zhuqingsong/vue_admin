<template>
  <div class="staff">
    <div class="staff-top">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
            @click="onAddMoney()"
          >添加</el-button>
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
        <el-table-column label="学员姓名" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.stu_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上级代理人" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.pname | formatST }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学员手机号" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.stu_phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="等级" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.role_msg }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缴费状态" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.stu_st | formatSV }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.data_current | moment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button
                    size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <UserDialong :dialong="dialong" :form="form" @UserData="userInfo"></UserDialong>
  </div>
</template>

<script>
// @ is an alias to /src
import UserDialong from "../components/UserDialong";
export default {
  name: "Staff",
  filters: {
    formatST(name) {
      return name || "没有代理人";
    },
    formatSV(ST) {
      return ST == 1 ? "已缴费" : "未缴费";
    }
  },
  data() {
    return {
      userData: [], //数据存储
      allTableData: [],
      paginations: {
        page_index: 1, //当前页
        total: 0, //总数
        page_size: 5, //一页显示多少
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper"
      },
      dialong: {
        //弹出框
        show: false,
        title: "",
        option: "edit"
      },
      form: {
        //添加和删除需要传递的字段名
        stu_name: "",
        parent_id: 0,
        parent_mobile: "",
        stu_phone: "",
        course_id: [],
        stu_st: 0,
        role_id: 1
      }
    };
  },
  methods: {
    userInfo() {
      this.$axios
        .get("/api/staff")
        .then(res => {
          console.log(res);
          this.allTableData = res.data;
          // console.log(this.tableData)
          this.setPaginations();
        })
        .catch(err => console.log(err));
    },
    handleEdit(index, row) {
      // console.log(row)
      // //编辑
      // this.dialong = {
      //   title: "编辑信息",
      //   show: true,
      //   option:"edit"
      // }
      // this.form = {
      //     name: row.name,
      //     sex: row.sex,
      //     state: row.state,
      //     hobby: row.hobby,
      //     marriage: row.marriage,
      //     birthday: row.birthday,
      //     address: row.address,
      //     id:row._id
      // }
    },
    handleDelete(index, row) {
      //删除数据
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`/api/staff/delete/${row.id}`).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          this.userInfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onAddMoney() {
      //添加内容
      this.dialong = {
        title: "添加学员",
        show: true,
        option: "add"
      };
      this.form = {
        stu_name: "",
        parent_id: 0,
        parent_mobile: "",
        stu_phone: "",
        course_id: []
      };
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
    UserDialong
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
