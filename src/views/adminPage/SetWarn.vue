<template>
    <div v-loading="loading">
        <h1>预警时间设置</h1>
        <div>
            <div>
                蓝色预警
            </div>
            <div>
                天数：
                <el-input-number v-model="blueNum" @change="handleChange" :min="0" :max="365"></el-input-number>
            </div>
        </div>
        <div>
            <div>
                黄色预警
            </div>
            <div>
                天数：
                <el-input-number v-model="yellowNum" @change="handleChange" :min="0" :max="365"></el-input-number>
            </div>
        </div>
        <div>
            <div>
                红色预警
            </div>
            <div>
                天数：
                <el-input-number v-model="redNum" @change="handleChange" :min="0" :max="365"></el-input-number>
            </div>
        </div>
        <div>
            <el-button @click="submit">提交修改</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                blueNum: 0,
                yellowNum: 0,
                redNum: 0,
            };
        },
        methods: {
            handleChange(value) {
                console.log(value);
            },
            submit() {
                this.loading = true
                const that = this
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('blueNum', this.blueNum)
                params.append('yellowNum', this.yellowNum)
                params.append('redNum', this.redNum)
                axios.post('/admin/warnSet', params)
                    .then(function (response) {
                        that.loading = false
                        console.log(response)
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else if (response.data === 1) {
                            that.$message.success("预警天数设置成功")
                            var user = JSON.parse(sessionStorage.getItem("user"))
                            user.bluenum = that.blueNum
                            user.yellownum = that.yellowNum
                            user.rednum = that.redNum
                            sessionStorage.setItem('user', JSON.stringify(user));//存储登录人
                        } else {
                            that.$message.error("预警天数设置失败")
                        }
                    })
            }
        },
        created() {
            var user = JSON.parse(sessionStorage.getItem("user"))
            //没有天数信息 则查询数据库
            if (user.bluenum === undefined || user.yellownum === undefined || user.rednum === undefined) {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                axios.post('/admin/selectWarnSet', params)
                    .then(function (response) {
                        that.loading = false
                        console.log(response)
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else {
                            user.bluenum = response.data.bluenum
                            user.yellownum = response.data.yellownum
                            user.rednum = response.data.rednum
                            console.log(user)
                            sessionStorage.setItem('user', JSON.stringify(user));//存储登录人
                            that.blueNum = user.bluenum
                            that.yellowNum = user.yellownum
                            that.redNum = user.rednum
                        }
                    })
            } else {
                user = JSON.parse(sessionStorage.getItem("user"))
                console.log(user)
                this.blueNum = user.bluenum
                this.yellowNum = user.yellownum
                this.redNum = user.rednum
            }
        }
    };
</script>