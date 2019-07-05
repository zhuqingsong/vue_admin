<template>
  <div class="list">
    <div class="staff-top">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
            @click="onAddParent()"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tab">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="序号" align="center" sortable width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代理人姓名" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.pname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代理人手机号" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.pmobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡号" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.bank_card }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户城市" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bank_city }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户行" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.bank_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户支行" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bank_branch_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加入时间" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.parent_join_time | moment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务客服" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cust_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客服微信号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cust_wx }}</span>
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
    <ParentDialong :dialong="dialong" :form="form" @UserData="getInfoList"></ParentDialong>
  </div>
</template>
<script>
import ParentDialong from "../components/ParentDialong";
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
        pmobile: "",
        pname: "",
        bank_card: "",
        bank_city: "",
        bank_name: "",
        bank_branch_name: "",
        parent_custom_id: 0
      }
    };
  },
  filters: {},
  methods: {
    // 添加代理人弹窗
    onAddParent() {
      this.dialong = {
        title: "添加代理人",
        show: true,
        option: "add",
        addview: false
      };
      this.form = {
        pmobile: "",
        pname: "",
        bank_card: "",
        bank_city: "",
        bank_name: "",
        bank_branch_name: "",
        parent_custom_id: 0,
        parent_custom_mobile: ""
      };
    },
    getInfoList() {
      this.$axios.get("/api/customlist/userlist").then(res => {
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
    ParentDialong
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