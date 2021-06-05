<template>
    <div v-loading="loading">
        <h1>历史消息</h1>
        <div v-for="item in unReadMessage">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>消息通知</span>
                </div>
                <div>发信人：{{item.sname}}</div>
                <div style="height: 10px"></div>
                <div>发信时间：{{item.time}}</div>
                <div style="height: 10px"></div>
                <div>消息内容：{{item.content}}</div>
                <div style="height: 10px"></div>
            </el-card>
            <div style="height: 30px"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "unReadMessages",
        data() {
            return {
                unReadMessage: null,
                loading:false
            }
        },
        methods: {
            select(){
                const that = this
                var params = new URLSearchParams()
                var token = sessionStorage.getItem("token")
                params.append("token", token)
                that.loading = true
                axios.post('/user/selectMessage', params)
                    .then(function (response) {
                        that.loading = false
                        console.log(response)
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else {
                            that.unReadMessage = response.data.messages
                            if(response.data.messages.length===0){
                                that.$message.warning("暂无未读消息")
                            }
                        }
                    })
            },
        },
        created() {
            this.select()
        }
    }
</script>

<style scoped>

</style>