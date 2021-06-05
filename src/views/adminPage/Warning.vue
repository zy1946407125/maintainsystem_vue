<template>
    <div>
        <!--        <div class="main" v-title data-title="预警提醒">-->
        <!--        </div>-->
        <div>
            <h1>预警提醒</h1>
        </div>
        <div style="display: flex;flex-direction: row;height: 50px">
            <span style="line-height: 50px">维修类别：</span>
            <el-select v-model="type" placeholder="请选择" style="line-height: 50px;width: 150px">
                <el-option
                        v-for="item in optionsType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div style="width: 30px"></div>
            <div style="width: 20px"></div>
            <span style="line-height: 50px">选择起始时间：</span>
            <el-date-picker
                    v-model="valueTime"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    value-format="timestamp"
                    style="width: 150px;line-height: 50px">
            </el-date-picker>
            <div style="width: 50px"></div>
            <span style="line-height: 50px">预警等级：</span>
            <el-select v-model="warnGrade" placeholder="请选择" style="width: 150px;line-height: 50px">
                <el-option
                        v-for="item in optionsWarn"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div style="width: 50px"></div>
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
                        width="360">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.imgsfileids1==null||scope.row.imgsfileids1=='[]'"
                                   slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg1(scope.row)">查看申报图片
                        </el-button>
                        <el-button :disabled="scope.row.imgsfileids2==null||scope.row.imgsfileids2=='[]'"
                                   slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg2(scope.row)">查看维修图片
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
        <div>
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
            handleClick(row) {
                console.log(row);
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
                const that = this
                var nowTime = new Date().getTime();
                console.log(this.type)
                console.log(this.warnGrade)
                console.log(this.valueTime)

                if (this.type === '') {
                    this.$message.error("请选择维修类别")
                } else if (this.valueTime === '') {
                    this.$message.error("请选择起始时间")
                } else if (this.warnGrade === '') {
                    this.$message.error("请选择预警等级")
                } else {
                    that.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('startTime', that.valueTime)
                    params.append('endTime', nowTime)
                    params.append('type', that.type)
                    params.append('pageNum', 1)
                    params.append('pageSize', this.size)
                    if (that.warnGrade === '蓝色') {
                        params.append('num1', that.user.bluenum)
                        params.append('num2', that.user.yellownum)
                    } else if (that.warnGrade === '黄色') {
                        params.append('num1', that.user.yellownum)
                        params.append('num2', that.user.rednum)
                    } else if (that.warnGrade === '红色') {
                        params.append('num1', that.user.rednum)
                        params.append('num2', 0)
                    }
                    axios.post('/admin/warning', params)
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
                const that = this
                var nowTime = new Date().getTime();
                console.log(this.type)
                console.log(this.warnGrade)
                console.log(this.valueTime)

                if (this.type === '') {
                    this.$message.error("请选择维修类别")
                } else if (this.valueTime === '') {
                    this.$message.error("请选择起始时间")
                } else if (this.warnGrade === '') {
                    this.$message.error("请选择预警等级")
                } else {
                    that.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('startTime', that.valueTime)
                    params.append('endTime', nowTime)
                    params.append('type', that.type)
                    params.append('pageNum', this.currentPage)
                    params.append('pageSize', this.size)
                    if (that.warnGrade === '蓝色') {
                        params.append('num1', that.user.bluenum)
                        params.append('num2', that.user.yellownum)
                    } else if (that.warnGrade === '黄色') {
                        params.append('num1', that.user.yellownum)
                        params.append('num2', that.user.rednum)
                    } else if (that.warnGrade === '红色') {
                        params.append('num1', that.user.rednum)
                        params.append('num2', 0)
                    }
                    axios.post('/admin/warning', params)
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


            formatterW_id(row, column, cellValue) {
                if (cellValue === 1) {
                    return '暂未指派'
                } else {
                    return cellValue
                }
            },
        },


        data() {
            return {
                type: '',
                warnGrade: '',
                currentPage: 1,
                size: 20,
                tableData: null,
                imgUrl: null,
                dialogFormVisible: false,
                total: null,
                loading: false,
                optionsType: [],
                optionsWarn: [{
                    value: '蓝色',
                    label: '蓝色'
                }, {
                    value: '黄色',
                    label: '黄色'
                }, {
                    value: '红色',
                    label: '红色'
                }],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            var date = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 6
                            date = new Date(date)
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            var date = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30
                            date = new Date(date)
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            var date = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 90
                            date = new Date(date)
                            picker.$emit('pick', date);
                        }
                    },]
                },
                valueTime: '',
            }
        },
        created() {

            var user = JSON.parse(sessionStorage.getItem("user"))
            var token = sessionStorage.getItem("token")
            var params
            //没有天数信息 则查询数据库
            if (user.bluenum === undefined || user.yellownum === undefined || user.rednum === undefined) {
                const that = this
                that.loading = true
                params = new URLSearchParams()
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
                        }
                    })
            }


            const that = this;
            that.loading = true;
            params = new URLSearchParams();
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

                    //设置初始时间默认一周
                    var date = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 6
                    var valueTime = date
                    that.valueTime = valueTime

                    that.warnGrade = that.optionsWarn[0].value

                    var user = JSON.parse(sessionStorage.getItem("user"))
                    that.user = user
                }
            })
        }
    }
</script>