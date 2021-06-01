<template>
    <div>
        <h1>正在维修</h1>
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
                        prop="consumable"
                        label="维修耗材"
                        width="220">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="360">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.imgsFileIDs=='[]'||scope.row.imgsFileIDs==null" slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg1(scope.row)">查看申报图片
                        </el-button>
                        <el-button :disabled="scope.row.imgsFileIDs2=='[]'||scope.row.imgsFileIDs2==null"
                                   slot="reference" icon="el-icon-s-promotion" @click="lookImg2(scope.row)">查看维修图片
                        </el-button>
                        <el-button slot="reference" @click="confirmOrder(scope.row)">确认维修完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="确认完成" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="维修耗材" :label-width="formLabelWidth">
                        <el-input v-model="form.consumable" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sendConsumable()">确 定</el-button>
                </div>
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
                dialogFormVisible: false,
                form: {
                    consumable: null,
                },
                formLabelWidth: '120px'
            }
        },
        methods: {
            confirmOrder(row) {
                this.dialogFormVisible = true
                this.row = row
            },
            sendConsumable() {
                console.log(this.row)
                console.log(this.form.consumable)
                if (this.form.consumable === null) {
                    this.$message.warning("请填写维修耗材！")
                } else {
                    const that = this
                    that.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('id', this.row.id)
                    params.append('consumable', this.form.consumable)
                    axios.post('/worker/completeOrder', params)
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
                params.append('status', '工人已接单')
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
            lookImg1(row) {
                console.log(row)
                var imgUrl = JSON.parse(row.imgsFileIDs)
                console.log(imgUrl)
                this.$router.push({
                    path: '/lookImg',
                    query: {
                        imgUrl: imgUrl
                    }
                })
            },
            lookImg2(row) {
                console.log(row)
                var imgUrl = JSON.parse(row.imgsFileIDs2)
                console.log(imgUrl)
                this.$router.push({
                    path: '/lookImg',
                    query: {
                        imgUrl: imgUrl
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