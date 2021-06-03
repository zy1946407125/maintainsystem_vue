<template>
    <div v-loading="loading">
        <h1>{{dept}}人员</h1>
        <div style="display: flex;flex-direction: row">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="编号" prop="id">
                    <el-input v-model="ruleForm.id" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="ruleForm.phone" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="addDeptUser('ruleForm')" icon=el-icon-circle-plus-outline>添加部门成员</el-button>
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
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="dept"
                        label="所在部门"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="联系方式"
                        width="200">
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
            addDeptUser(formName) {
                console.log(this.ruleForm.id)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = new URLSearchParams()
                        let that = this
                        that.loading = true
                        let id = this.ruleForm.id
                        let dept = this.ruleForm.dept
                        let phone = this.ruleForm.phone
                        let name = this.ruleForm.name
                        const token = sessionStorage.getItem("token");
                        params.append('token', token)
                        params.append('id', id)
                        params.append('phone', phone)
                        params.append('username', name)
                        axios.post('/manager/addDeptUser', params).then(function (response) {
                            that.loading = false
                            console.log(response)
                            that.loading = false
                            if (response.data.status === 444) {
                                that.$message.error("您的登录信息已过期，请重新登录")
                                that.$router.replace("/")
                            } else if (response.data.status === 445) {
                                that.$message.error("您没有此操作权限")
                            } else if (response.data === 1) {
                                that.$message.success("添加部门成员成功")
                                that.ruleForm.id = null
                                that.ruleForm.phone = null
                                that.ruleForm.name = null
                                that.selectUsersByDept()
                            } else {
                                that.$message.error("添加失败")
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            selectUsersByDept() {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('dept', this.dept)
                axios.post('/manager/selectUsersByDept', params)
                    .then(function (response) {
                        console.log(response)
                        that.loading = false
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else {
                            console.log(response)
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
                axios.post('/manager/deleteDeptUser', params)
                    .then(function (response) {
                        that.loading = false
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else if (response.data === 1) {
                            that.$message.success("删除成功")
                            that.selectUsersByDept()
                        } else if (response.data === -1) {
                            that.$message.error("该用户存在工单，无法删除")
                        } else {
                            that.$message.error("删除失败")
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
            const PhoneRegex = /^[0-9]*$/;
            var checkPhone = (rule, value, callback) => {
                if (PhoneRegex.test(value)) {
                    callback();
                } else {
                    callback(new Error('必须为数字'));
                }
            };
            return {
                loading: true,
                tableData: null,
                dept: null,
                ruleForm: {
                    id: null,
                    phone: null,
                    name: null,
                },
                rules: {
                    id: [
                        {required: true, message: '请输入用户编号', trigger: 'blur'},
                        {validator: checkId, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入用户手机号', trigger: 'blur'},
                        {min: 7, max: 11, message: '长度为 7 到 11 位的数字', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入用户姓名', trigger: 'blur'},
                    ],
                },
            }
        },
        created() {
            const user = JSON.parse(sessionStorage.getItem("user"))
            this.dept = user.dept
            this.selectUsersByDept()
        },
    }
</script>