<template>
    <div v-loading="loading">
        <h1>重置密码</h1>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="注册手机号" prop="phone">
                <el-input v-model="ruleForm.phone" autocomplete="off" style="width: 200px"></el-input>
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
                <el-button type="primary" @click="submitForm('ruleForm')">立即重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            const IdRegex = /^[0-9]*$/;
            var checkId = (rule, value, callback) => {
                if (IdRegex.test(value)) {
                    var params = new URLSearchParams()
                    var that = this
                    params.append('id', value)
                    axios.post('/user/verifyId', params)
                        .then(function (response) {
                            if (response.data === 0) {
                                callback();
                            } else {
                                callback(new Error('该编号已注册'));
                            }
                        })
                } else {
                    callback(new Error('必须为数字'));
                }
            };
            const PhoneRegex = /^[0-9]*$/;
            var checkPhone = (rule, value, callback) => {
                if (PhoneRegex.test(value)) {
                    var params = new URLSearchParams()
                    var that = this
                    params.append('phone', value)
                    axios.post('/user/verifyPhone', params)
                        .then(function (response) {
                            if (response.data === 1) {
                                callback();
                            } else {
                                callback(new Error('该手机号尚未注册，请核实'));
                            }
                        })
                } else {
                    callback(new Error('必须为数字'));
                }
            };
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
            const CodeRegex = /^[0-9]{6}$/;
            var checkCode = (rule, value, callback) => {
                if (CodeRegex.test(value)) {
                    callback();
                } else {
                    callback(new Error('请输入6位数字验证码'));
                }
            };
            return {
                getCode: '获取验证码',
                isGeting: false,
                count: 60,
                disable: false,
                loading: false,
                ruleForm: {
                    id: '',
                    username: '',
                    phone: '',
                    pass: '',
                    checkPass: '',
                    code: ''
                },
                rules: {
                    id: [
                        {required: true, message: '输入不能为空！', trigger: 'blur'},
                        {validator: checkId, trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '输入不能为空！', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '输入不能为空！', trigger: 'blur'},
                        {min: 7, max: 11, message: '长度在 7 到 11 个字符', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                    pass: [
                        {required: true, message: '输入不能为空！', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {required: true, message: '输入不能为空！', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '输入不能为空！', trigger: 'blur'},
                        {validator: checkCode, trigger: 'blur'}
                    ],
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
                        var that = this
                        var id = this.ruleForm.id
                        var username = this.ruleForm.username
                        var phone = this.ruleForm.phone
                        var password = this.ruleForm.checkPass
                        var code = this.ruleForm.code
                        params.append('phone', phone)
                        params.append('password', password)
                        params.append('code', code)
                        that.loading = true
                        axios.post('/user/resetPassword', params)
                            .then(function (response) {
                                that.loading = false
                                if (response.data === 1) {
                                    that.$message.success("密码重置成功，请重新登录")
                                    that.$router.push('/')//跳转登录页面
                                } else if (response.data === 0) {
                                    that.$message.error("密码重置失败")
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
                if (this.ruleForm.phone == null || this.ruleForm.phone == "") {
                    this.$message.error("请输入手机号")
                } else {
                    var params = new URLSearchParams()
                    var that = this
                    params.append('phone', this.ruleForm.phone)
                    axios.post('/user/verifyPhone', params)
                        .then(function (response) {
                            if (response.data === 1) {
                                axios.post('/sendCode', params)
                                    .then(function (response) {
                                        that.loading = false
                                        if (response.data === 1) {
                                            that.$message({
                                                type: 'success',
                                                message: '发送成功!请注意查收'
                                            });
                                            that.codeTime()
                                        } else {
                                            that.$message.error("验证码发送失败")
                                        }
                                    })
                            } else {
                                that.$message.warning("该手机号尚未注册，请核实")
                            }
                        })
                }
            }
        },
        created() {

        }
    }
</script>

<style>
    .codeGeting {
        background: #cdcdcd;
        border-color: #cdcdcd;
    }
</style>