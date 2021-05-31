<template>
    <div v-loading="loading">
        <div style="display: flex;flex-direction: row">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="编号" prop="id">
                    <el-input v-model="ruleForm.id" autocomplete="off" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="维修类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择维修类型">
                        <el-option v-for="(item,index) in optionsType"
                                   :key="index"
                                   :value="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button @click="addWorker('ruleForm')" icon=el-icon-circle-plus-outline>添加维修人员</el-button>
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
                        prop="type"
                        label="工作类型"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="联系方式"
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
            addWorker(formName){
                console.log(this.ruleForm.id)
                console.log(this.ruleForm.type)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = new URLSearchParams()
                        let that = this
                        that.loading = true
                        let id = this.ruleForm.id
                        let type = this.ruleForm.type
                        const token = sessionStorage.getItem("token");
                        params.append('token', token)
                        params.append('wid', id)
                        params.append('type', type)
                        axios.post('/superAdmin/addWorker', params).then(function (response) {
                            that.loading = false
                            console.log(response)
                            that.loading = false
                            if (response.data.status === 444) {
                                that.$message.error("您的登录信息已过期，请重新登录")
                                that.$router.replace("/")
                            } else if (response.data.status === 445) {
                                that.$message.error("您没有此操作权限")
                            } else if (response.data === 1) {
                                that.$message.success("添加维修人员成功")
                                that.selectWorkers()
                            } else if (response.data === -1) {
                                that.$message.error("该编号用户尚未注册，请先注册")
                            }else {
                                that.$message.error("未知错误")
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
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
                        for (let i = 0; i < response.data.length; i++) {
                            let tmp = {
                                value: response.data[i].type,
                                label: response.data[i].type
                            }
                            that.optionsType.push(tmp)
                        }
                    }
                })
            },
            selectWorkers() {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)

                axios.post('/admin/selectWorkers', params)
                    .then(function (response) {
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
                params.append('wid', row.id)

                axios.post('/superAdmin/deleteWorker', params)
                    .then(function (response) {
                        that.loading = false
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else if (response.data === 1) {
                            that.$message.success("删除成功")
                            that.selectWorkers()
                        } else if (response.data === -1) {
                            that.$message.error("该维修人员已有工单，无法删除")
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
                optionsType: [],
                ruleForm: {
                    id: null,
                    type: null,
                },
                rules: {
                    id: [
                        {required: true, message: '请输入用户编号', trigger: 'blur'},
                        {validator: checkId, trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择维修类型', trigger: 'change'}
                    ],
                },
            }
        },
        created() {
            this.selectWorkers()
            this.selectWorkType()
        },
    }
</script>