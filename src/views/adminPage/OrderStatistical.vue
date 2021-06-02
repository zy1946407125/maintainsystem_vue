<template>
    <div id="printChart">
        <div class="block">
            <div style="width: 50px"></div>
            <div style="display: flex;flex-direction: row">
                <h1>工单完成情况统计表</h1>
            </div>
            <el-date-picker
                    v-model="value2"
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
            <el-button @click="select()" id="select">查询</el-button>
            <el-button v-print="'#printChart'" icon="el-icon-printer" @click="del()" type="primary" plain id="print">
                打印图表
            </el-button>
        </div>
        <div style="height: 20px"></div>
        <div>
            <div style="width:1002px;
		    display: block;
		    margin:0 auto;
">
                <el-table
                        v-loading="loading"
                        :data="tableData"
                        border
                        style="width: 100%;font-size: 20px">
                    <el-table-column
                            fixed="left"
                            prop="type"
                            label="维修类别"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            prop="acceptnum"
                            label="申报数"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            prop="completenum"
                            label="完成数"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            prop="percentage"
                            label="完成率"
                            width="250">
                    </el-table-column>
                </el-table>
            </div>
            <div style="height: 20px"></div>
            <div style="display: flex;flex-direction: column" id="echart">
                <div id="main1" style="width: 1000px;height:600px;"></div>
                <div id="main2" style="width: 1000px;height:600px;"></div>
            </div>
            <div>
                <img src="" id="img1">
                <img src="" id="img2">
            </div>
        </div>
    </div>
</template>
<script>
    export default {

        data() {
            return {
                tableData: [],
                loading: false,
                chartText: [],
                chartData1: [],
                chartData2: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
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
                            // start.setTime(start - 3600 * 1000 * 24 * 7);
                            end = new Date(end)
                            start = new Date(start)
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            var end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
                            var start = new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 90
                            // start.setTime(start - 3600 * 1000 * 24 * 7);
                            end = new Date(end)
                            start = new Date(start)
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value1: '',
                value2: ''
            };
        },
        methods: {
            drawChart() {
                //基于准备好的dom，初始化echarts实例
                var myChart1 = this.$echarts.init(document.getElementById('main1'));
                var myChart2 = this.$echarts.init(document.getElementById('main2'));
                var that = this
                myChart1.setOption({
                    title: {
                        text: '申报数',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '申报数 : {c} ({d}%)'
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        data: this.chartText
                    },
                    series: [
                        {
                            type: 'pie',
                            roseType: 'angle',
                            radius: '65%',
                            center: ['50%', '50%'],
                            selectedMode: 'single',
                            data: this.chartData1
                        },
                    ]
                });

                myChart2.setOption({
                    title: {
                        text: '完成率'
                    },
                    tooltip: {},
                    xAxis: {
                        data: this.chartText
                    },
                    yAxis: {},
                    series: [{
                        type: 'bar',
                        data: this.chartData2,
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                                    var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                    }]
                });

                myChart1.on('finished', function () {
                    console.log("ok1")
                    var img1 = myChart1.getDataURL();
                    that.img1 = img1
                    // document.getElementById("img1").setAttribute('src',img1)
                });
                myChart2.on('finished', function () {
                    console.log("ok2")
                    var img2 = myChart2.getDataURL();
                    that.img2 = img2
                    // document.getElementById("img2").setAttribute('src',img2)
                });

            },
            select() {
                var startTime = this.value2[0]
                var endTime = this.value2[1]
                var that = this
                console.log(startTime)
                console.log(endTime)
                if (startTime === undefined || endTime === undefined) {
                    that.$message.error("请选择统计时间段")
                } else {
                    that.chartData1 = []
                    that.chartData2 = []
                    this.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('startTime', startTime)
                    params.append('endTime', endTime)
                    axios.post('/admin/orderStatistical', params)
                        .then(function (response) {
                            that.loading = false
                            console.log(response)
                            if (response.data.status === 444) {
                                that.$message.error("您的登录信息已过期，请重新登录")
                                that.$router.replace("/")
                            } else if (response.data.status === 445) {
                                that.$message.error("您没有此操作权限")
                            } else {
                                that.tableData = response.data
                                for (var i = 0; i < response.data.length; i++) {
                                    that.tableData[i].percentage = (response.data[i].completenum * 100.0 / response.data[i].acceptnum).toFixed(2) + '%'
                                    that.chartText.push(response.data[i].type)
                                    var tmp = {
                                        value: response.data[i].acceptnum,
                                        name: response.data[i].type
                                    }
                                    that.chartData1.push(tmp)
                                    that.chartData2.push(response.data[i].completenum * 100.0 / response.data[i].acceptnum)
                                }
                                that.drawChart();
                            }

                        })
                }
            },
            del() {
                document.getElementById("select").remove()
                document.getElementById("print").remove()
                document.getElementById("echart").remove();
                document.getElementById("img1").setAttribute('src', this.img1)
                document.getElementById("img2").setAttribute('src', this.img2)
            }
        },
    };
</script>

<style>

</style>

