<template>
    <div v-loading="loading">
        <div style="display: flex;flex-direction: row">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="编号" prop="id">
                    <el-input v-model="ruleForm.id" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="addAdmin('ruleForm')" icon=el-icon-circle-plus-outline>添加管理人员</el-button>
        </div>
        <div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        fixed="left"
                        prop="id"
                        label="编号"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="联系方式"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="power"
                        label="权限"
                        :formatter="formatterPower"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-popconfirm
                                title="确认删除吗？"
                                @confirm="del(scope.row)"
                        >
                            <el-button slot="reference" icon="el-icon-delete">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            formatterPower: function (row, column, cellValue) {
                if (cellValue === "Max") {
                    return '超级管理员'
                } else {
                    return '普通管理员'
                }
            },
            addAdmin(formName) {
                console.log(this.ruleForm.id)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = new URLSearchParams()
                        let that = this
                        that.loading = true
                        let id = this.ruleForm.id
                        const token = sessionStorage.getItem("token");
                        params.append('token', token)
                        params.append('id', id)
                        axios.post('/superAdmin/addAdmin', params).then(function (response) {
                            that.loading = false
                            console.log(response)
                            that.loading = false
                            if (response.data.status === 444) {
                                that.$message.error("您的登录信息已过期，请重新登录")
                                that.$router.replace("/")
                            } else if (response.data.status === 445) {
                                that.$message.error("您没有此操作权限")
                            } else if (response.data === 1) {
                                that.$message.success("添加管理员成功")
                                that.selectAdmins()
                            } else if (response.data === -1) {
                                that.$message.error("该编号用户尚未注册，请先注册")
                            } else {
                                that.$message.error("未知错误")
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            selectAdmins() {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)

                axios.post('/admin/selectAdmins', params)
                    .then(function (response) {
                        console.log(response)
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
            del(row) {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('id', row.id)

                axios.post('/superAdmin/deleteAdmin', params)
                    .then(function (response) {
                        that.loading = false
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else if (response.data === 1) {
                            that.$message.success("删除成功")
                            that.selectAdmins()
                        } else {
                            that.$message.error("未知错误")
                        }
                    })
            }
        },
        data() {
            const IdRegex = /^[0-9]*$/;
            var checkId = (rule, value, callback) => {
                if (IdRegex.test(value)) {
                    callback();
                } else {
                    callback(new Error('必须为数字'));
                }
            };
            return {
                loading: false,
                tableData: null,
                ruleForm: {
                    id: null,
                },
                rules: {
                    id: [
                        {required: true, message: '请输入用户编号', trigger: 'blur'},
                        {validator: checkId, trigger: 'blur'}
                    ],
                },
            }
        },
        created() {
            this.selectAdmins()
        },
    }
</script>