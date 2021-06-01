<template>
    <div>
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
                        width="450">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.imgsfileids1==null" slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg1(scope.row)">查看申报图片
                        </el-button>
                        <el-button type="primary" slot="reference" icon="el-icon-s-promotion"
                                   @click="handleClick(scope.row)">派单
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="查看图片" :visible.sync="dialogFormVisible" top="0vh" width="30%">
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
                id: '',
                size: 10,
                tableData: null,
                total: null,
                loading: true,
                dialogFormVisible: false,
                imgUrl:null,
            }
        },
        methods: {
            handleClick(row){
                console.log(row)
                this.$router.push({
                    path: '/admin/chooseWorker',
                    query: {
                        order: row
                    }
                })
            },
            select() {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('type', "全部类别")
                params.append('status', "未派单")
                params.append('pageNum', 1)
                params.append('pageSize', that.size)
                axios.post('/admin/selectOrders', params)
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
                this.dialogFormVisible = true
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
                this.dialogFormVisible = true
            },
        },
        created() {
            this.select()
        }
    }
</script>

<style scoped>

</style>