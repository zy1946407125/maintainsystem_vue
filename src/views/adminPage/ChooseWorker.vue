<template>
    <div v-loading="loading">
        <!--        <div class="main" v-title data-title="选择维修工人">-->
        <!--        </div>-->
        <div>
            <h1>选择维修工人</h1>
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
                                title="确认向其派单吗？"
                                @confirm="send(scope.row)"
                        >
                            <el-button slot="reference" icon="el-icon-s-promotion">派单</el-button>
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
            send(row) {
                const that = this
                that.loading = true
                console.log(row)
                const token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('id', that.id)
                params.append('wid', row.id)
                console.log(that.id)
                console.log(row.id)
                axios.post('/admin/sendOrder', params)
                    .then(function (response) {
                        console.log(response)
                        that.loading = false
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else if (response.data === 1) {
                            that.$message.success("派单成功")
                            that.$router.replace('/admin/sendOrder')
                        }else {
                            that.$message.error("未知错误")
                        }
                    })
            }
        },
        data() {
            return {
                loading: false,
                tableData: null,
            }
        },
        created() {
            const that = this
            that.id = this.$route.query.order.id //工单编号
            that.address = this.$route.query.order.address//维修地址
            that.reason = this.$route.query.order.reason//维修原因
            that.uname = this.$route.query.order.username
            that.uphone = this.$route.query.order.phone
            that.starttime = this.$route.query.starttime

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
    }
</script>