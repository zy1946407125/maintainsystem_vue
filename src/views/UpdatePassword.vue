<template>
    <div v-loading="loading">
        <h1>修改密码</h1>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="编号" prop="id">
                <el-input v-model="ruleForm.id" autocomplete="off" style="width: 200px" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone" autocomplete="off" style="width: 200px" disabled></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"
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
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
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
                    pass: '',
                    checkPass: '',
                    code: ''
                },
                rules: {
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
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
                        var that = this
                        var token = sessionStorage.getItem("token")
                        params.append('token', token)
                        params.append('phone', user.phone)
                        params.append('password', that.ruleForm.checkPass)
                        params.append('code', that.ruleForm.code)
                        that.loading = true
                        axios.post('/user/changePassword', params)
                            .then(function (response) {
                                that.loading = false
                                console.log(response)
                                if (response.data.status === 444) {
                                    that.$message.error("您的登录信息已过期，请重新登录")
                                    that.$router.replace("/")
                                } else if (response.data.status === 445) {
                                    that.$message.error("您没有此操作权限")
                                } else if (response.data === 1) {
                                    that.$message.success("密码修改成功，请重新登录")
                                    sessionStorage.removeItem("loginState")//清除登录状态
                                    sessionStorage.removeItem("user")
                                    that.$router.push('/')//跳转登录页面
                                } else if (response.data === 0) {
                                    that.$message.error("密码修改失败")
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
                var params = new URLSearchParams()
                var user = JSON.parse(sessionStorage.getItem('user'))
                var that = this
                var token = sessionStorage.getItem("token")
                params.append('token', token)
                params.append('phone', user.phone)
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
        },
        created() {
            var user = JSON.parse(sessionStorage.getItem('user'))
            this.ruleForm.id = user.id
            this.ruleForm.phone = user.phone
        }
    }
</script>

<style>

</style>