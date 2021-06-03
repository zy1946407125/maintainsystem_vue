<template>
    <div v-loading="loading">
        <h1>系部</h1>
        <div>
            <el-input :value="dept" v-model="dept" style="width: 400px"></el-input>
            <el-button @click="addDept()" type="primary" plain>新增系部</el-button>
        </div>
        <el-table id="table"
                  v-loading="loading"
                  :data="tableData"
                  border
                  style="width: 100%">
            <el-table-column
                    fixed="left"
                    prop="dept"
                    label="系部名称"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="createtime"
                    label="创建时间"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="createname"
                    label="创建人"
                    width="220">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-popconfirm
                            title="确认删除该系部吗？"
                            @confirm="del(scope.row)"
                    >
                        <el-button slot="reference" icon="el-icon-delete">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "Dept",
        data() {
            return {
                loading: false,
                dept: null,
                tableData: null,
            }
        },
        methods: {
            del(row) {
                console.log(row.dept)
                const token = sessionStorage.getItem("token");
                const that = this;
                that.loading = true;
                let params = new URLSearchParams();
                params.append('token', token)
                params.append('dept', row.dept)
                axios.post("/superAdmin/deleteDept", params).then(function (response) {
                    console.log(response)
                    that.loading = false
                    if (response.data.status === 444) {
                        that.$message.error("您的登录信息已过期，请重新登录")
                        that.$router.replace("/")
                    } else if (response.data.status === 445) {
                        that.$message.error("您没有此操作权限")
                    } else if (response.data === 1) {
                        that.$message.success("删除成功")
                        that.selectDept()
                    } else if (response.data === -1) {
                        that.$message.error("该系部已有用户，无法删除")
                    } else {
                        that.$message.error("未知错误")
                    }
                })
            },
            selectDept() {
                const token = sessionStorage.getItem("token");
                const that = this;
                that.loading = true;
                let params = new URLSearchParams();
                params.append('token', token)
                axios.post("/user/selectDept", params).then(function (response) {
                    that.loading = false
                    console.log(response)
                    if (response.data.status === 444) {
                        that.$message.error("您的登录信息已过期，请重新登录")
                        that.$router.replace("/")
                    } else if (response.data.status === 445) {
                        that.$message.error("您没有此操作权限")
                    } else {
                        that.tableData = response.data
                    }
                })
            },
            addDept() {
                if (this.dept === null || this.dept === "") {
                    this.$message.error("请填写系部名称")
                } else {
                    const token = sessionStorage.getItem("token");
                    const that = this;
                    that.loading = true;
                    let params = new URLSearchParams();
                    params.append('token', token);
                    params.append('dept', this.dept)
                    axios.post('/superAdmin/addDept', params).then(function (response) {
                        console.log(response)
                        that.loading = false
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else if (response.data === 1) {
                            that.$message.success("系部添加成功")
                            that.dept = null
                            that.selectDept()
                        } else {
                            that.$message.error("系部添加失败")
                        }
                    })
                }
            }
        },
        created() {
            this.selectDept()
        }
    }
</script>

<style scoped>

</style>