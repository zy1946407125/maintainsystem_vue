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
                    <el-menu :default-openeds="['1','2','3']" router>
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-user"></i>人员管理</template>
                            <el-menu-item index="/manager/deptUsers"
                                          :class="$route.path=='/manager/deptUsers'?'is-active':''">部门人员
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-user"></i>工单管理</template>
                            <el-menu-item index="/manager/deptOrders"
                                          :class="$route.path=='/manager/deptOrders'?'is-active':''">部门工单
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="el-icon-user"></i>设置</template>
                            <el-menu-item index="/manager/updatePassword"
                                          :class="$route.path=='/manager/updatePassword'?'is-active':''">修改密码
                            </el-menu-item>
                            <el-menu-item index="/manager/updatePhone"
                                          :class="$route.path=='/manager/updatePhone'?'is-active':''">修改手机号
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
                name: "部门负责人"
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

                        localStorage.removeItem("phone")
                        localStorage.removeItem("password")
                        localStorage.removeItem("selectedtype")

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