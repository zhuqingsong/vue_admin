<template>
  <div class="list">
    <div class="staff-top">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
            @click="onAddCourse()"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="课程ID" align="center" sortable width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.course_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.course_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程价格" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.course_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程老师" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.teach_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程状态" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.course_st | kc_st }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程折扣" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.course_discout }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程返现比例" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.course_cash_scale }}</span>
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
            >{{ scope.row.course_st | ck_t }}</el-button>
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
    <KcDialong :dialong="dialong" :form="form" @UserData="getInfoList"></KcDialong>
  </div>
</template>
<script>
import KcDialong from "../components/KcDialong";
export default {
  name: "list",
  data() {
    return {
      tableData: [], //数据
      paginations: {
        page_index: 1, //当前页
        total: 0, //总数
        page_size: 5, //一页显示多少
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper"
      },
      allTableData: [],
      dialong: {
        //弹出框
        show: false,
        title: "",
        option: "add"
      },
      form: {
        //添加和删除需要传递的字段名
        course_name: "",
        course_price: "",
        course_teach_id: "",
        course_cash_scale: "",
        course_discout: ""
      }
    };
  },
  filters: {
    kc_st(val) {
      return val == 1 ? "正常" : "已下线";
    },
    ck_t(val) {
      return val == 1 ? "下线" : "上线";
    }
  },
  methods: {
    // 添加代理人弹窗
    onAddCourse() {
      this.dialong = {
        title: "添加课程",
        show: true,
        option: "add"
      };
      this.form = {
        course_name: "",
        course_price: "",
        course_teach_id: "1",
        course_cash_scale: "",
        course_discout: ""
      };
    },
    handleNologin(index, row) {
      this.$confirm("确认要下线课程吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(`/api/course/nologin/${row.course_id}/${row.course_st}`)
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
    },
    getInfoList() {
      this.$axios.get("/api/course/courselist").then(res => {
        console.log(res);
        const data = res.data;
        // this.tableData = data;
        this.allTableData = data;
        // console.log(this.tableData)
        this.setPaginations();
      });
    },
    setPaginations() {
      this.paginations.total = this.allTableData.length; //数据的数量
      this.paginations.page_index = 1; //默认显示第一页
      this.paginations.page_size = 5; //每页显示多少数据

      //显示数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1; //第一页
      this.paginations.page_size = page_size; //每页先显示多少数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
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
        this.tableData = tablist;
      }
    }
  },
  created() {
    this.getInfoList();
  },
  components: {
    KcDialong
  }
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