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
                      style="width: 100%"
                      :cell-style="cellStyle">
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
                        prop="w_reason"
                        label="工人退单理由"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="a_reason"
                        label="管理员拒绝理由"
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
                        <el-button :disabled="scope.row.imgsfileids1==null" slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg1(scope.row)">查看申报图片
                        </el-button>
                        <el-button :disabled="scope.row.imgsfileids2==null"
                                   slot="reference" icon="el-icon-s-promotion" @click="lookImg2(scope.row)">查看维修图片
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
    import global_ from "../Base";

    export default {
        data() {
            return {
                id: '',
                status: '',
                type: '',
                valueTime: '',
                size: 10,
                tableData: null,
                total: null,
                loading: true,
                imgUrl: null,
                dialogFormVisible: false,
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
                }
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
            cellStyle(row, column, rowIndex, columnIndex) {//根据报警级别显示颜色
                // console.log(row);
                // console.log(row.column);
                if (row.row.status === '已完成') {
                    return 'background:LightGreen'
                } else if (row.row.status === '管理员已派单') {
                    return 'background:LightSkyBlue'
                } else if (row.row.status === '未派单') {
                    return 'background:Pink'
                } else if (row.row.status === '工人确认完成') {
                    return 'background:Khaki'
                }
            }
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
                }
            })
        },
    }
</script>

<style scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }

</style>