<template>
    <div>
        <h1>确认接单</h1>
        <div id="father">
            <el-table id="table"
                      v-loading="loading"
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
                        prop="type"
                        label="维修类别"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="维修地址"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="reason"
                        label="维修原因"
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="starttime"
                        label="提交时间"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="updatetime"
                        label="更新时间"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="uname"
                        label="提交人姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="uphone"
                        label="提交人联系方式"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="400">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.imgsfileids1==null||scope.row.imgsfileids1=='[]'"
                                   slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg1(scope.row)">查看申报图片
                        </el-button>
                        <el-popconfirm
                                title="确认接单吗？"
                                @confirm="confirmOrder(scope.row)"
                        >
                            <el-button slot="reference">确认接单</el-button>
                        </el-popconfirm>
                        <el-button slot="reference" @click="cancelOrder(scope.row)">申请退单</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="申请退单" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="退单原因" :label-width="formLabelWidth">
                        <el-input v-model="form.workerReason" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sendWorkerReason()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="查看图片" :visible.sync="dialogFormVisible2" top="0vh" width="30%">
                <el-carousel indicator-position="outside" height="1000px">
                    <el-carousel-item v-for="item in imgUrl" :key="item">
                        <el-image :src="item" fit="contain"></el-image>
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                size: 10,
                tableData: null,
                loading: true,
                imgUrl: null,
                dialogFormVisible2: false,
                row: null,
                dialogFormVisible: false,
                form: {
                    workerReason: null,
                },
                formLabelWidth: '120px'
            }
        },
        methods: {
            lookImg1(row) {
                console.log(row)
                var imgUrl = JSON.parse(row.imgsfileids1)
                console.log(imgUrl)
                for (var i = 0; i < imgUrl.length; i++) {
                    imgUrl[i] = this.GLOBAL.BASE_URL + "/upload/" + imgUrl[i]
                }
                console.log(imgUrl)
                this.imgUrl = imgUrl
                this.dialogFormVisible2 = true
            },
            lookImg2(row) {
                console.log(row)
                var imgUrl = JSON.parse(row.imgsfileids2)
                console.log(imgUrl)
                for (var i = 0; i < imgUrl.length; i++) {
                    imgUrl[i] = this.GLOBAL.BASE_URL + "/upload/" + imgUrl[i]
                }
                console.log(imgUrl)
                this.imgUrl = imgUrl
                this.dialogFormVisible2 = true
            },
            sendWorkerReason() {
                console.log(this.row)
                console.log(this.form.workerReason)
                if (this.form.workerReason === null||this.form.workerReason === '') {
                    this.$message.warning("请填写退单原因！")
                } else {
                    const that = this
                    that.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('id', this.row.id)
                    params.append('workerReason', this.form.workerReason)
                    axios.post('/worker/cancelOrder', params)
                        .then(function (response) {
                            that.loading = false
                            console.log(response)
                            if (response.data.status === 444) {
                                that.$message.error("您的登录信息已过期，请重新登录")
                                that.$router.replace("/")
                            } else if (response.data.status === 445) {
                                that.$message.error("您没有此操作权限")
                            } else if (response.data === 1) {
                                that.$message.success("提交申请成功")
                                that.dialogFormVisible = false
                                that.select()
                            } else if (response.data === 0) {
                                that.$message.error("提交失败")
                            } else {
                                that.$message.error("未知错误")
                            }
                        })
                }
            },
            confirmOrder(row) {
                console.log(row)
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('id', row.id)
                axios.post('/worker/confirmOrder', params)
                    .then(function (response) {
                        that.loading = false
                        console.log(response)
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else if (response.data === 1) {
                            that.$message.success("接单成功")
                            that.select()
                        } else if (response.data === 0) {
                            that.$message.error("接单失败")
                        } else {
                            that.$message.error("未知错误")
                        }
                    })
            },
            cancelOrder(row) {
                this.dialogFormVisible = true
                this.row = row
            },
            select() {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('status', '管理员已派单')
                axios.post('/worker/selectOrders', params)
                    .then(function (response) {
                        that.loading = false
                        console.log(response)
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else {
                            that.tableData = response.data.orders
                            that.total = response.data.total
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