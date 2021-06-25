<template>
    <div v-loading="loading">
        <h1>更新手机号</h1>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="编号" prop="id">
                <el-input v-model="ruleForm.id" autocomplete="off" style="width: 200px" disabled></el-input>
            </el-form-item>
            <el-form-item label="新手机号" prop="newPhone">
                <el-input v-model="ruleForm.newPhone" autocomplete="off"
                          style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
                <el-input v-model.number="ruleForm.code" style="width: 200px"></el-input>
                <el-button type="primary" :disabled="disable" :class="{ codeGeting:isGeting }" @click="send()">
                    {{getCode}}
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            const NumRegex = /^[0-9]*$/;
            var checkNum = (rule, value, callback) => {
                if (NumRegex.test(value)) {
                    callback();
                } else {
                    callback(new Error('必须为数字'));
                }
            };
            return {
                getCode: '获取验证码',
                isGeting: false,
                count: 60,
                loading: false,
                disable: false,
                ruleForm: {
                    id: '',
                    phone: '',
                    newPhone: '',
                    code: ''
                },
                rules: {
                    newPhone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {min: 7, max: 11, message: '长度为 7 到 11 位的数字', trigger: 'blur'},
                        {validator: checkNum, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            //验证码计时
            codeTime() {
                var countDown = setInterval(() => {
                    if (this.count < 1) {
                        this.isGeting = false;
                        this.disable = false;
                        this.getCode = '获取验证码';
                        this.count = 60;
                        clearInterval(countDown);
                    } else {
                        this.isGeting = true;
                        this.disable = true;
                        this.getCode = this.count-- + 's后获取';
                    }
                }, 1000);
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var params = new URLSearchParams()
                        var user = JSON.parse(sessionStorage.getItem('user'))
                        var token = sessionStorage.getItem("token")
                        var that = this
                        params.append('token', token)
                        params.append('phone', that.ruleForm.newPhone)
                        params.append('code', that.ruleForm.code)
                        that.loading = true
                        axios.post('/user/changePhone', params)
                            .then(function (response) {
                                that.loading = false
                                console.log(response)
                                if (response.data.status === 444) {
                                    that.$message.error("您的登录信息已过期，请重新登录")
                                    that.$router.replace("/")
                                } else if (response.data.status === 445) {
                                    that.$message.error("您没有此操作权限")
                                } else if (response.data === 1) {
                                    that.$message.success("手机号修改成功，请重新登录")
                                    sessionStorage.removeItem("loginState")//清除登录状态
                                    sessionStorage.removeItem("user")
                                    localStorage.removeItem("phone")
                                    localStorage.removeItem("password")
                                    localStorage.removeItem("selectedtype")
                                    that.$router.push('/')//跳转登录页面
                                } else if (response.data === 0) {
                                    that.$message.error("手机号修改失败")
                                } else if (response.data === 2) {
                                    that.$message.error("验证码错误")
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
            send() {
                console.log(this.ruleForm.newPhone)
                if (this.ruleForm.newPhone === '') {
                    this.$message.error("请输入新的手机号")
                } else {
                    var params = new URLSearchParams()
                    var user = JSON.parse(sessionStorage.getItem('user'))
                    var that = this
                    var token = sessionStorage.getItem("token")
                    params.append('token', token)
                    params.append('phone', this.ruleForm.newPhone)
                    that.loading = true
                    axios.post('/sendCode', params)
                        .then(function (response) {
                            that.loading = false
                            console.log(response)
                            if (response.data.status === 444) {
                                that.$message.error("您的登录信息已过期，请重新登录")
                                that.$router.replace("/")
                            } else if (response.data.status === 445) {
                                that.$message.error("您没有此操作权限")
                            } else if (response.data === 1) {
                                that.$message.success("发送验证码成功")
                                that.codeTime()
                            } else {
                                that.$message.error("发送验证码失败")
                            }
                        })
                }
            }
        },
        created() {
            var user = JSON.parse(sessionStorage.getItem('user'))
            this.ruleForm.id = user.id
        }
    }
</script>