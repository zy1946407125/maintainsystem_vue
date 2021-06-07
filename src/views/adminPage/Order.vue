<template>
    <div>
        <div style="display: flex;flex-direction: row;height: 50px">
            <span style="line-height: 50px">工单状态：</span>
            <el-select v-model="status" placeholder="请选择" style="line-height: 50px">
                <el-option
                        v-for="item in optionsStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div style="width: 20px"></div>
            <span style="line-height: 50px">维修类别：</span>
            <el-select v-model="type" placeholder="请选择" style="line-height: 50px">
                <el-option
                        v-for="item in optionsType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div style="width: 10px"></div>
            <span style="line-height: 50px">选择起止时间：</span>
            <div style="line-height: 50px">
                <el-date-picker
                        v-model="valueTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        :default-time="['00:00:00', '23:59:59']"
                        value-format="timestamp">
                </el-date-picker>
            </div>
            <div style="width: 20px"></div>
            <el-button @click="select()" id="select" icon="el-icon-search" type="primary">查询</el-button>
        </div>
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
                        prop="wname"
                        label="维修人姓名"
                        :formatter="formatterW_name"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="wphone"
                        label="维修人联系方式"
                        :formatter="formatterW_phone"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="workerreason"
                        label="工人申请退单理由"
                        :formatter="formatterW_reason"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="adminreason"
                        label="管理员拒绝退单理由"
                        :formatter="formatterA_reason"
                        width="200">
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
                        <el-button :disabled="scope.row.imgsfileids1==null||scope.row.imgsfileids1=='[]'"
                                   slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg1(scope.row)">查看申报图片
                        </el-button>
                        <el-button :disabled="scope.row.imgsfileids2==null||scope.row.imgsfileids2=='[]'"
                                   slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg2(scope.row)">查看维修图片
                        </el-button>
                        <el-popconfirm
                                title="确认取消工单吗？"
                                @confirm="cancelOrder(scope.row)"
                        >
                            <el-button
                                    :disabled="scope.row.status=='已完成'||scope.row.status=='管理员已撤单'||scope.row.status=='工人已撤单'||scope.row.status=='用户已撤单'"
                                    slot="reference"
                                    icon="el-icon-s-promotion">撤单
                            </el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[5,10,20, 50, 100]"
                        :page-size="size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
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
                status: '',
                type: '',
                valueTime: '',
                currentPage: 1,
                size: 20,
                tableData: null,
                total: null,
                imgUrl: null,
                dialogFormVisible: false,
                loading: true,
                optionsType: [],
                optionsStatus: [{
                    value: '全部状态',
                    label: '全部状态'
                }, {
                    value: '未派单',
                    label: '未派单'
                }, {
                    value: '用户已撤单',
                    label: '用户已撤单'
                }, {
                    value: '管理员已派单',
                    label: '管理员已派单'
                }, {
                    value: '管理员已撤单',
                    label: '管理员已撤单'
                }, {
                    value: '工人申请退单',
                    label: '工人申请退单'
                }, {
                    value: '工人已退单',
                    label: '工人已退单'
                }, {
                    value: '工人已接单',
                    label: '工人已接单'
                }, {
                    value: '工人已完成',
                    label: '工人已完成'
                }, {
                    value: '已完成',
                    label: '已完成'
                }],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            var end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
                            var start = new Date(new Date().toLocaleDateString()).getTime()
                            // start.setTime(start - 3600 * 1000 * 24 * 7);
                            end = new Date(end)
                            start = new Date(start)
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三天',
                        onClick(picker) {
                            var end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
                            var start = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 2
                            // start.setTime(start - 3600 * 1000 * 24 * 7);
                            end = new Date(end)
                            start = new Date(start)
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            var end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
                            var start = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 6
                            // start.setTime(start - 3600 * 1000 * 24 * 7);
                            end = new Date(end)
                            start = new Date(start)
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            var end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
                            var start = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30
                            end = new Date(end)
                            start = new Date(start)
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            var end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
                            var start = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 90
                            end = new Date(end)
                            start = new Date(start)
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        methods: {
            formatterW_reason: function (row, column, cellValue) {
                // if (cellValue === "" || cellValue === null) {
                //     console.log('未申请退单')
                //     return '未申请退单'
                // } else {
                //     console.log('已申请退单')
                //     return cellValue
                // }
                return cellValue
            },
            formatterA_reason: function (row, column, cellValue) {
                // if (cellValue === "" || cellValue === null) {
                //     return '未申请退单或已同意退单'
                // } else {
                //     return cellValue
                // }
                return cellValue
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                console.log(this.size)
                this.select()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.select2()
            },
            cancelOrder(row) {
                console.log(row)
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('id', row.id)
                axios.post('/admin/removeOrder', params).then(function (response) {
                    console.log(response)
                    that.loading = false
                    if (response.data.status === 444) {
                        that.$message.error("您的登录信息已过期，请重新登录")
                        that.$router.replace("/")
                    } else if (response.data.status === 445) {
                        that.$message.error("您没有此操作权限")
                    } else if (response.data === 1) {
                        that.$message.success("撤单成功")
                        that.select()
                    } else {
                        that.$message.error("撤单失败")
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
            select() {
                console.log(this.status)
                console.log(this.type)
                console.log(this.valueTime)
                if (this.valueTime === "") {
                    this.$message.error("请输入查询时间")
                } else {
                    const that = this
                    that.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('status', this.status)
                    params.append('type', this.type)
                    params.append("startTime", this.valueTime[0])
                    params.append('endTime', this.valueTime[1])
                    params.append('pageNum', 1)
                    params.append('pageSize', this.size)
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
                                that.currentPage = 1
                            }
                        })
                }
            },
            select2() {
                console.log(this.status)
                console.log(this.type)
                console.log(this.valueTime)
                if (this.valueTime === "") {
                    this.$message.error("请输入查询时间")
                } else {
                    const that = this
                    that.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('status', this.status)
                    params.append('type', this.type)
                    params.append("startTime", this.valueTime[0])
                    params.append('endTime', this.valueTime[1])
                    params.append('pageNum', this.currentPage)
                    params.append('pageSize', this.size)
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
                }
            },
            formatterW_phone: function (row, column, cellValue) {
                if (cellValue === "0") {
                    return '暂未派单'
                } else {
                    return cellValue
                }
            },
            formatterW_name: function (row, column, cellValue) {
                if (cellValue === "不可用") {
                    return '暂未派单'
                } else {
                    return cellValue
                }
            },
        },
        created() {
            const token = sessionStorage.getItem("token");
            const that = this;
            that.loading = true;
            let params = new URLSearchParams();
            params.append('token', token)
            axios.post("/user/selectWorkType", params).then(function (response) {
                that.loading = false
                if (response.data.status === 444) {
                    that.$message.error("您的登录信息已过期，请重新登录")
                    that.$router.replace("/")
                } else if (response.data.status === 445) {
                    that.$message.error("您没有此操作权限")
                } else {
                    let tmp = {
                        value: "全部类别",
                        label: "全部类别"
                    }
                    that.optionsType.push(tmp)
                    for (let i = 0; i < response.data.length; i++) {
                        let tmp = {
                            value: response.data[i].type,
                            label: response.data[i].type
                        }
                        that.optionsType.push(tmp)
                    }
                    that.type = that.optionsType[0].value
                    that.status = that.optionsStatus[0].value

                    //设置初始时间默认一周
                    var end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
                    var start = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 6
                    var valueTime = new Array()
                    valueTime.push(start)
                    valueTime.push(end)
                    that.valueTime = valueTime
                }
            })
        }
    }
</script>

<style scoped>

</style>