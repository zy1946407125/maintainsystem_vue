<template>
    <div>
        <div style="display: flex;flex-direction: row;height: 50px;">
            <el-button v-print="'#printChart'" icon="el-icon-printer" @click="del()" type="primary" plain id="print">
                打印图表
            </el-button>
        </div>
        <div id="printChart">
            <h1>工人维修完成率统计表</h1>
            <div>
                <el-table
                        v-loading="loading"
                        :data="tableData"
                        border
                        style="width: 100%;font-size: 20px">
                    <el-table-column
                            fixed="left"
                            prop="id"
                            label="编号"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="姓名"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="工作类型"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="联系方式"
                            width="155">
                    </el-table-column>
                    <el-table-column
                            prop="acceptnum"
                            label="接单数量"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="completenum"
                            label="完成数量"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="score.avg_score1"
                            label="维修速度"
                            :formatter="formatterScore1"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="score.avg_score2"
                            label="维修质量"
                            :formatter="formatterScore2"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="score.avg_score3"
                            label="维修员态度"
                            :formatter="formatterScore3"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="percentage"
                            label="完成率"
                            width="100">
                    </el-table-column>
                </el-table>
            </div>
            <div style="display: flex;flex-direction: row" id="echart">
                <div id="main2" style="width: 1200px;height:350px;"></div>
            </div>
            <div>
                <img src="" id="img2">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            handleClick(row) {
                console.log(row);
            },
            del() {
                document.getElementById("echart").remove();
                document.getElementById("img2").setAttribute('src', this.img2)
            },
            drawChart(chartDataName, chartDataPercentage) {
                //基于准备好的dom，初始化echarts实例
                var myChart2 = this.$echarts.init(document.getElementById('main2'));
                var that = this

                myChart2.setOption({
                    tooltip: {},
                    xAxis: {
                        data: chartDataName,
                    },
                    yAxis: {},
                    series: [{
                        type: 'bar',
                        data: chartDataPercentage,
                        barWidth: 40,
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

                myChart2.on('finished', function () {
                    console.log("ok2")
                    var img2 = myChart2.getDataURL();
                    that.img2 = img2
                    // document.getElementById("img2").setAttribute('src',img2)
                });

            },
            formatterScore1: function (row, column, cellValue) {
                if (cellValue === null) {
                    return '暂无评分'
                } else {
                    return cellValue
                }
            },
            formatterScore2: function (row, column, cellValue) {
                if (cellValue === null) {
                    return '暂无评分'
                } else {
                    return cellValue
                }
            },
            formatterScore3: function (row, column, cellValue) {
                if (cellValue === null) {
                    return '暂无评分'
                } else {
                    return cellValue
                }
            },
        },
        data() {
            return {
                name: '',
                size: 7,
                tableData: null,
                total: null,
                loading: true
            }
        },
        created() {
            const that = this
            var token = sessionStorage.getItem("token")
            var params = new URLSearchParams()
            that.loading = true
            params.append('token', token)
            axios.post('/admin/workerStatistical', params)
                .then(function (response) {
                    that.loading = false
                    console.log(response)
                    if (response.data.status === 444) {
                        that.$message.error("您的登录信息已过期，请重新登录")
                        that.$router.replace("/")
                    } else if (response.data.status === 445) {
                        that.$message.error("您没有此操作权限")
                    } else {
                        var chartDataName = new Array()
                        var chartDataPercentage = new Array();
                        that.tableData = response.data
                        for (var i = 0; i < response.data.length; i++) {
                            that.tableData[i].percentage = (response.data[i].completenum * 100.0 / response.data[i].acceptnum).toFixed(2) + '%'
                            chartDataName.push(response.data[i].username)
                            chartDataPercentage.push(response.data[i].completenum * 100.0 / response.data[i].acceptnum)
                        }
                        that.drawChart(chartDataName, chartDataPercentage);
                    }

                })
        },
    }
</script>