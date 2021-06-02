<template>
    <div>
        <div style="display: flex;flex-direction: row">
            <div style="width: 300px"></div>
            <div style="width: 50px"></div>
            <el-button v-print="'#printOrder'" icon="el-icon-printer" type="primary" plain>打印工单</el-button>
            <el-button @click="cancel()">返回</el-button>
        </div>
        <div id="printOrder">
            <div style="height: 20px"></div>
            <div id="printOrder1">
                <div style="text-align: center;">
                    <h1>湖南警察学院维修（派工联）</h1>
                </div>
                <div>
                    <table v-for="item in orders" border="1px" width="1000px" cellpadding="10px" rules="all"
                           align="center">
                        <tr height="50px">
                            <td width="25%" class="td3">工单编号</td>
                            <td width="25%" class="td1">{{item.id}}</td>
                            <td width="25%" class="td3">申报时间</td>
                            <td width="25%" class="td1">{{item.starttime}}</td>
                        </tr>
                        <tr height="50px">
                            <td width="25%" class="td3">报修人</td>
                            <td width="25%" class="td1">{{item.uname}}</td>
                            <td width="25%" class="td3">联系方式</td>
                            <td width="25%" class="td1">{{item.uphone}}</td>
                        </tr>
                        <tr height="50px">
                            <td width="25%" class="td3">维修人</td>
                            <td width="25%" class="td1">{{item.wname}}</td>
                            <td width="25%" class="td3">联系方式</td>
                            <td width="25%" class="td1">{{item.wphone}}</td>
                        </tr>
                        <tr height="50px">
                            <td width="25%" rowspan="2" class="td3">维修内容</td>
                            <td width="25%" class="td3">维修类型</td>
                            <td width="25%" class="td3">维修原因</td>
                            <td width="25%" class="td3">维修地址</td>
                        </tr>
                        <tr height="50px">
                            <td width="25%" class="td1">{{item.type}}</td>
                            <td width="25%" class="td1">{{item.reason}}</td>
                            <td width="25%" class="td1">{{item.address}}</td>
                        </tr>
                    </table>
                    <table border="1px" width="1000px" cellpadding="10px" rules="all" align="center">
                        <tr height="50px">
                            <td width="25%" class="td3">科室意见</td>
                            <td width="40%" class="td1">拟派维修公司：</td>
                            <td colspan="2" class="td1">签名：___________日期：___________</td>
                        </tr>
                        <tr height="50px">
                            <td width="25%" class="td3">处领导审批</td>
                            <td width="40%" class="td1">
                                <nobr>
                                    <img src="../../assets/square.png" class="imgs">同意
                                    <img src="../../assets/space.png" class="imgs">
                                    <img src="../../assets/space.png" class="imgs">
                                    <img src="../../assets/square.png" class="imgs">不同意
                                </nobr>
                            </td>
                            <td colspan="2" class="td1">签名：___________日期：___________</td>
                        </tr>
                        <tr height="50px">
                            <td width="25%" class="td3">公司任务领取人签名</td>
                            <td width="40%" class="td1"></td>
                            <td colspan="2" class="td1">领取时间：______日______时______分</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div style="height: 70px"></div>
            <div>
                <div id="printOrder2">
                    <div style="text-align: center;">
                        <h1>湖南警察学院维修（执行联）</h1>
                    </div>
                    <div>
                        <table border="1px" width="1000px" cellpadding="10px" rules="all" align="center">
                            <tr height="50px">
                                <td width="20%" rowspan="9" class="td3">维修公司填报</td>
                                <td width="20%" class="td1">到达时间</td>
                                <td width="20%" class="td1">____日____时____分</td>
                                <td width="20%" class="td1">完成时间</td>
                                <td width="20%" class="td1">____日____时____分</td>
                            </tr>
                            <tr>
                                <td width="20%" rowspan="6" class="td1">施工环节及内容<br>(主要材料应注明品牌、规格型号、和用量)</td>
                                <td rowspan="6" colspan="3" class="td1"></td>
                            </tr>
                            <tr height="50px"></tr>
                            <tr height="50px"></tr>
                            <tr height="50px"></tr>
                            <tr height="50px"></tr>
                            <tr height="50px"></tr>
                            <tr height="50px">
                                <td width="20%" class="td1">费用概算（元）<br>（含税）</td>
                                <td width="20%" class="td1"></td>
                                <td width="20%" class="td1">是否拍照</td>
                                <td width="20%" class="td1">
                                    <img src="../../assets/square.png" class="imgs">是
                                    <img src="../../assets/space.png" class="imgs">
                                    <img src="../../assets/square.png" class="imgs">否
                                </td>
                            </tr>
                            <tr height="50px">
                                <td width="20%" class="td1">维修人签名</td>
                                <td width="20%" class="td1"></td>
                                <td width="20%" class="td1">联系电话</td>
                                <td width="20%" class="td1"></td>
                            </tr>
                        </table>
                        <table border="1px" width="1000px" cellpadding="10px" rules="all" align="center">
                            <tr height="50px">
                                <td width="20%" rowspan="3" class="td3">报修人验收意见</td>
                                <td width="20%" rowspan="2" colspan="4" class="td2">更换的可见全新材料(或物品)名称及数量：</td>
                            </tr>
                            <tr height="50px"></tr>
                            <tr height="50px">
                                <td width="20%" class="td3">质量意见：</td>
                                <td width="30%" class="td1">
                                    <img src="../../assets/square.png" class="imgs">合格
                                    <img src="../../assets/space.png" class="imgs">
                                    <img src="../../assets/square.png" class="imgs">不合格
                                </td>
                                <td colspan="2" class="td1">签名：_________日期：_________</td>
                            </tr>
                            <tr height="50px">
                                <td width="20%" class="td3">后勤维修负责人复审</td>
                                <td width="20%" class="td3">意见：</td>
                                <td width="30%" class="td1"></td>
                                <td colspan="2" class="td1">签名：_________日期：_________</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                orders: null,
                header: false,
                hiddenTableHeader: false,
            }

        },
        methods: {
            cancel() {
                this.$router.go(-1);
            },
        },
        created() {
            this.orders = this.$route.query.orders
            console.log(this.orders)
        },
    }
</script>
<style scoped>
    .td1 {
        font-family: "Microsoft YaHei";
        font-size: larger;
        color: #333333;
    }

    .td2 {
        font-family: "Microsoft YaHei";
        font-size: larger;
        color: #333333;
        text-align: left;
        vertical-align: top;
        font-weight: bold;
    }

    .td3 {
        font-family: "Microsoft YaHei";
        font-size: larger;
        color: #333333;
        font-weight: bold;
    }

    .imgs {
        width: 25px;
        height: 23px;
        top: 20px;
        vertical-align: middle;
    }
</style>