<template>
    <div v-loading="loading">
        <h1>维修类别</h1>
        <div>
            <el-input :value="workType" v-model="workType" style="width: 400px"></el-input>
            <el-button @click="addWorkType()" type="primary" plain>新增维修类别</el-button>
        </div>
        <el-table id="table"
                  v-loading="loading"
                  :data="tableData"
                  border
                  style="width: 100%">
            <el-table-column
                    fixed="left"
                    prop="type"
                    label="维修类别"
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
                            title="确认删除该维修类型吗？"
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
        name: "WorkType",
        data() {
            return {
                loading: true,
                workType: null,
                tableData: null,
            }
        },
        methods: {
            del(row) {
                console.log(row.type)
                const token = sessionStorage.getItem("token");
                const that = this;
                that.loading = true;
                let params = new URLSearchParams();
                params.append('token', token)
                params.append('type', row.type)
                axios.post("/superAdmin/deleteWorkType", params).then(function (response) {
                    console.log(response)
                    that.loading = false
                    if (response.data.status === 444) {
                        that.$message.error("您的登录信息已过期，请重新登录")
                        that.$router.replace("/")
                    } else if (response.data.status === 445) {
                        that.$message.error("您没有此操作权限")
                    } else if (response.data === 1) {
                        that.$message.success("删除成功")
                        that.selectWorkType()
                    } else if (response.data === -1) {
                        that.$message.error("该维修类型已有工单，无法删除")
                    }else {
                        that.$message.error("错误")
                    }
                })
            },
            selectWorkType() {
                const token = sessionStorage.getItem("token");
                const that = this;
                that.loading = true;
                let params = new URLSearchParams();
                params.append('token', token)
                axios.post("/user/selectWorkType", params).then(function (response) {
                    that.loading = false
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
            addWorkType() {
                if (this.workType === null || this.workType === "") {
                    this.$message.error("请填写维修类别名称")
                } else {
                    const token = sessionStorage.getItem("token");
                    const that = this;
                    that.loading = true;
                    let params = new URLSearchParams();
                    params.append('token', token);
                    params.append('type', this.workType)
                    axios.post('/superAdmin/addWorkType', params).then(function (response) {
                        console.log(response)
                        that.loading = false
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else if (response.data === 1) {
                            that.$message.success("维修类别添加成功")
                            that.workType = null
                            that.selectWorkType()
                        } else {
                            that.$message.error("维修类别添加失败")
                        }
                    })
                }
            }
        },
        created() {
            this.selectWorkType()
        }
    }
</script>

<style scoped>

</style>