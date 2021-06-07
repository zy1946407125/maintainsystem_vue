<template>
    <div>
        <!--        <div class="main" v-title data-title="湖南警察学院维修管理系统">-->
        <!--        </div>-->
        <el-container>
            <!--            <el-header style="text-align: center;line-height: 45px;height: 90px">-->
            <!--                <h1 style="line-height: 45px;">湖南警察学院维修管理系统</h1>-->
            <!--            </el-header>-->
            <el-header style="text-align: center;line-height: 45px;height: 95px">
                <div>
                    <div style="height: 5px"></div>
                    <div style="font-size: 35px;font-weight: bold">湖南警察学院维修管理系统</div>
                    <div style="display: flex;flex-direction: row;float:right">
                        <div>欢迎您：{{name}}</div>
                        <div style="width: 20px"></div>
                        <el-popconfirm
                                title="确认退出系统吗？"
                                @confirm="logout">
                            <el-button type="danger" slot="reference" plain>退出</el-button>
                        </el-popconfirm>
                        <div style="width: 50px"></div>
                    </div>
                </div>
            </el-header>
            <el-container style="height: 100%; border: 1px solid #eee">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <el-menu :default-openeds="['1','2','3','4']" router>
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-user"></i>人员管理</template>
                            <el-menu-item index="/admin/selectAdmins"
                                          :class="$route.path=='/admin/selectAdmins'?'is-active':''">管理人员
                            </el-menu-item>
                            <el-menu-item index="/admin/selectWorkers"
                                          :class="$route.path=='/admin/selectWorkers'?'is-active':''">维修人员
                            </el-menu-item>
                            <el-menu-item index="/admin/selectManagers"
                                          :class="$route.path=='/admin/selectManagers'?'is-active':''">部门负责人
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-user"></i>工单管理</template>
                            <el-menu-item index="/admin/order" :class="$route.path=='/admin/order'?'is-active':''">工单查询
                            </el-menu-item>
                            <el-menu-item index="/admin/sendOrder"
                                          :class="$route.path=='/admin/sendOrder'?'is-active':''">工单指派
                            </el-menu-item>
                            <el-menu-item index="/admin/handOrder"
                                          :class="$route.path=='/admin/handOrder'?'is-active':''">退单申请
                            </el-menu-item>
                            <el-menu-item index="/admin/Warning"
                                          :class="$route.path=='/admin/Warning'?'is-active':''">预警提醒
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="el-icon-user"></i>图表统计</template>
                            <el-menu-item index="/admin/orderStatistical"
                                          :class="$route.path=='/admin/orderStatistical'?'is-active':''">工单统计
                            </el-menu-item>
                            <el-menu-item index="/admin/workerStatistical"
                                          :class="$route.path=='/admin/workerStatistical'?'is-active':''">工人统计
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="4">
                            <template slot="title"><i class="el-icon-user"></i>设置</template>
                            <el-menu-item index="/admin/updatePassword"
                                          :class="$route.path=='/admin/updatePassword'?'is-active':''">修改密码
                            </el-menu-item>
                            <el-menu-item index="/admin/updatePhone"
                                          :class="$route.path=='/admin/updatePhone'?'is-active':''">修改手机号
                            </el-menu-item>
                            <el-menu-item index="/admin/workType"
                                          :class="$route.path=='/admin/workType'?'is-active':''">维修类别
                            </el-menu-item>
                            <el-menu-item index="/admin/dept" :class="$route.path=='/admin/dept'?'is-active':''">部门管理
                            </el-menu-item>
                            <el-menu-item index="/admin/setWarn" :class="$route.path=='/admin/setWarn'?'is-active':''">
                                预警天数
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!--                    <router-view></router-view>-->
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive">
                            <!-- 这里是会被缓存的视图组件，比如 Home！ -->
                        </router-view>
                    </keep-alive>

                    <router-view v-if="!$route.meta.keepAlive"></router-view>
                    <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: "管理员"
            }
        },
        methods: {
            logout() {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                axios.post('/user/logout', params).then(function (response) {
                    console.log(response)
                    that.loading = false
                    if (response.data.status === 444) {
                        that.$message.error("您的登录信息已过期，请重新登录")
                        that.$router.replace("/")
                    } else if (response.data.status === 445) {
                        that.$message.error("您没有此操作权限")
                    } else if (response.data === 1) {
                        sessionStorage.removeItem("user")
                        sessionStorage.removeItem("loginState")
                        sessionStorage.removeItem("token")
                        that.$message.success("退出成功")
                        that.$router.replace('/')
                    } else {
                        that.$message.error("退出失败")
                    }
                })
            }
        },
        created() {
            var user = JSON.parse(sessionStorage.getItem("user"))
            this.name = user.username
        }
    }
</script>

<style scoped>

</style>