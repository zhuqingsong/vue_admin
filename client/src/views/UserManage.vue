<template>
  <div class="list">
    <div class="tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="序号" align="center" sortable width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.status |format_st }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button
                    size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button
              size="mini"
              type="danger"
              @click="handleNologin(scope.$index, scope.row)"
            >{{ scope.row.status | status }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "list",
  data() {
    return {
      tableData: [], //数据
      role: ["确定启用该账号？", "禁用该客服，该客服将不能登陆?"]
    };
  },
  filters: {
    format_st(val) {
      return val == 1 ? "正常" : val == 2 ? "超级管理员" : "禁用";
    },
    status(val) {
      return val == 0 ? "启用" : val == 2 ? "超级管理员" : "禁用";
    }
  },
  methods: {
    getInfoList() {
      this.$axios.get("/api/users/usermanagelist").then(res => {
        console.log(res);
        this.tableData = res.data;
        // this.tableData = data;
        // console.log(this.tableData)
      });
    },
    handleNologin(index, row) {
      if (row.status == 2) {
        this.$message({
          type: "error",
          message: "超级管理员不能禁用"
        });
        return false;
      }
      let avatar = localStorage.avatar;
      avatar = JSON.parse(avatar);
      if (avatar.st == 1) {
        this.$message({
          type: "error",
          message: "你没有权利禁用其他用户"
        });
        return false;
      }

      this.$confirm(this.role[row.status], "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(`/api/users/nologin/${row.id}/${row.status}`)
            .then(res => {
              this.$message({
                type: "success",
                message: "成功!"
              });
            });
          this.getInfoList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  },
  created() {
    this.getInfoList();
  },
  components: {}
};
</script>

<style scoped>
.list {
  margin: 20px;
}
.page {
  float: right;
  margin-top: 20px;
}
</style>