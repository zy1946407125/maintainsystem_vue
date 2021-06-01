<template>
    <div>
        <h1>维修完成</h1>
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
                        prop="wname"
                        label="维修人姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="wphone"
                        label="维修人联系方式"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="consumable"
                        label="维修耗材"
                        width="220">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="500">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.imgsfileids1==null" slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg1(scope.row)">查看申报图片
                        </el-button>
                        <el-button :disabled="scope.row.imgsfileids2==null"
                                   slot="reference" icon="el-icon-s-promotion" @click="lookImg2(scope.row)">查看维修图片
                        </el-button>
                        <el-button slot="reference" @click="confirmOrder(scope.row)">确认维修完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="确认完成" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="维修评价" :label-width="formLabelWidth">
                        <el-input v-model="form.comment" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <center>
                    <span>维修速度</span>
                    <el-rate
                            v-model="value1"
                            show-text>
                    </el-rate>
                    <span>维修质量</span>
                    <el-rate
                            v-model="value2"
                            show-text>
                    </el-rate>
                    <span>维修员态度</span>
                    <el-rate
                            v-model="value3"
                            show-text>
                    </el-rate>
                </center>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sendComment()">确 定</el-button>
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
                row: null,
                imgUrl:null,
                dialogFormVisible: false,
                dialogFormVisible2:false,
                form: {
                    comment: null,
                },
                formLabelWidth: '120px',
                value1: null,
                value2: null,
                value3: null,

            }
        },
        methods: {
            confirmOrder(row) {
                this.dialogFormVisible = true
                this.row = row
            },
            sendComment() {
                console.log(this.row)
                console.log(this.form.comment)
                console.log(this.value1)
                console.log(this.value2)
                console.log(this.value3)
                if (this.form.comment === null) {
                    this.$message.warning("请填写维修评价！")
                } else if (this.value1 === 0 || this.value2 === 0 || this.value3 === 0) {
                    this.$message.warning("请选择维修评分！")
                } else {
                    const that = this
                    that.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('id', this.row.id)
                    params.append('comment', this.form.comment)
                    params.append('score1', this.value1)
                    params.append('score2', this.value2)
                    params.append('score3', this.value3)
                    axios.post('/user/completeOrder', params)
                        .then(function (response) {
                            that.loading = false
                            console.log(response)
                            if (response.data.status === 444) {
                                that.$message.error("您的登录信息已过期，请重新登录")
                                that.$router.replace("/")
                            } else if (response.data.status === 445) {
                                that.$message.error("您没有此操作权限")
                            } else if (response.data === 1) {
                                that.$message.success("确认成功")
                                that.dialogFormVisible = false
                                that.select()
                            } else if (response.data === 0) {
                                that.$message.error("确认失败")
                            } else {
                                that.$message.error("未知错误")
                            }
                        })
                }
            },
            select() {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('status', '工人已完成')
                axios.post('/user/selectOrders', params)
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
        },
        created() {
            this.select()
        }
    }
</script>

<style scoped>

</style>