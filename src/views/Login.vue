<template>
    <div>
        <span class="background">
		</span>
        <div class="logo-div">
            <img src="../assets/hnjcxy.png" style="margin-top:20px; ">
            <span class="app_name">湖南警察学院维修系统</span>
        </div>
        <div class="login-div" v-loading="loading">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <h3 class="login-title">欢迎登录</h3>

                <el-select v-model="selectedtype" placeholder="请选择账号类别" style="line-height: 50px">
                    <el-option
                            v-for="item in type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-form-item label="账号" prop="phone">
                    <el-input
                            v-model="ruleForm.phone"
                            style="width: 200px"
                            prefix-icon="el-icon-user-solid"
                            placeholder="请输入手机号"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input
                            v-model="ruleForm.password"
                            style="width: 200px"
                            show-password
                            clearable
                            prefix-icon="el-icon-lock"
                            placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-checkbox v-model="checked">记住账号信息</el-checkbox>
                <div style="height: 15px"></div>
                <el-form-item class="login-button">
                    <el-button type="primary" @click="submitForm('ruleForm')" class="button">登录</el-button>
                </el-form-item>

            </el-form>
            <!--            <div style="color: black;cursor: pointer;" @click="registerUser">没有账号？立即注册</div>-->
            <div style="color: black;cursor: pointer;" @click="forgotPassword">忘记密码？</div>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';

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
                checked: true,
                selectedtype: null,
                type: [{
                    value: 'admin',
                    label: '管理员'
                }, {
                    value: 'worker',
                    label: '维修人员'
                }, {
                    value: 'manager',
                    label: '部门负责人'
                }, {
                    value: 'user',
                    label: '普通用户'
                }],
                loading: false,
                ruleForm: {
                    phone: '',
                    password: '',
                },
                rules: {
                    phone: [
                        {required: true, message: '输入不能为空！', trigger: 'blur'},
                        {min: 7, max: 11, message: '长度在 7 到 11 个字符', trigger: 'blur'},
                        {validator: checkNum, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '输入不能为空！', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            registerUser() {
                this.$router.push('/register')
            },
            forgotPassword() {
                this.$router.push('/resetPassword')
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const that = this
                        if (that.selectedtype === null) {
                            that.$message.error('请选择账号类别');
                        } else {
                            that.loading = true
                            var params = new URLSearchParams()
                            params.append('phone', that.ruleForm.phone)
                            params.append('password', that.ruleForm.password)
                            axios.post('/user/login', params)
                                .then(function (response) {
                                    console.log(response)
                                    if (response.data.status === 1) {
                                        var i = 0
                                        for (i = 0; i < response.data.user.role.length; i++) {
                                            if (response.data.user.role[i] === that.selectedtype) {
                                                that.loading = false
                                                that.$message.success("登录成功")
                                                sessionStorage.setItem('loginState', response.data.status);//存储登录状态
                                                sessionStorage.setItem('user', JSON.stringify(response.data.user));//存储登录人
                                                sessionStorage.setItem('token', response.data.token);//存储token

                                                if (that.checked) {
                                                    localStorage.setItem("phone", that.ruleForm.phone)
                                                    localStorage.setItem("password", that.ruleForm.password)
                                                    localStorage.setItem("selectedtype", that.selectedtype)
                                                }else {
                                                    localStorage.removeItem("phone")
                                                    localStorage.removeItem("password")
                                                    localStorage.removeItem("selectedtype")
                                                }

                                                var path = "/" + that.selectedtype + "/index"
                                                that.$router.replace(path)
                                                break
                                            }
                                        }
                                        if (i >= response.data.user.role.length) {
                                            that.loading = false
                                            that.$message.error('账号无此登录权限');
                                        }
                                    } else {
                                        that.loading = false
                                        that.$message.error('账号不存在或密码错误');
                                    }
                                })
                        }
                    } else {
                        this.$message.error('请输入有效数值');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        created() {
            this.ruleForm.phone = localStorage.getItem("phone")
            this.ruleForm.password = localStorage.getItem("password")
            this.selectedtype = localStorage.getItem("selectedtype")
            console.log(this.ruleForm.phone)
            console.log(this.ruleForm.password)
            console.log(this.selectedtype)
        }
    }
</script>
<style>
    .login-div {
        color: #FFFFFF;
        position: absolute;
        border: 1px solid #ffffff;
        padding: 35px 35px 15px 300px;
        box-shadow: 0 2px 4px #ffffff;
        background-color: azure;
        background-image: url(../assets/login-left.png);
        background-repeat: no-repeat;
        background-position: left;
        text-align: center;
        width: 25%;
        top: 30%;
        left: 25%;
        right: 25%;
    }

    .login-title {
        text-indent: 50px;
        text-align: center;
        margin: 0 auto 40px auto;
        color: #303133;
        font-family: Microsoft YaHei;
    }

    .login-button {
        margin-left: 30px;
    }

    .button {
        width: 150px;
        left: 30%;
    }

    .logo-div {
        position: absolute;
        width: 100%;
        height: 100%;
        text-align: center;
    }

    .background {
        background-image: url(../assets/bg.png);
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
    }

    .app_name {
        color: #fff;
        line-height: 80px;
        font-size: 35px;
        font-family: Microsoft YaHei;
        margin: 10px 0 0 20px;
    }

</style>