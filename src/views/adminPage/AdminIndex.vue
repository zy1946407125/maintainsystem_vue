<template>
    <div>
        <!--        <div class="main" v-title data-title="湖南警察学院维修管理系统">-->
        <!--        </div>-->
        <el-container>
            <el-header style="text-align: center;line-height: 45px;height: 90px">
                <h1 style="line-height: 45px;">湖南警察学院维修管理系统</h1>
            </el-header>
            <el-container style="height: 100%; border: 1px solid #eee">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <el-menu :default-openeds="['1','2','3']" router>
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-user"></i>人员管理</template>
                            <el-menu-item index="/admin/selectAdmins" :class="$route.path=='/admin/selectAdmins'?'is-active':''">管理人员
                            </el-menu-item>
                            <el-menu-item index="/admin/selectWorkers" :class="$route.path=='/admin/selectWorkers'?'is-active':''">维修人员
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-user"></i>工单管理</template>
                            <el-menu-item index="/admin/order" :class="$route.path=='/admin/order'?'is-active':''">工单查询
                            </el-menu-item>
                            <el-menu-item index="/admin/sendOrder" :class="$route.path=='/admin/sendOrder'?'is-active':''">工单指派
                            </el-menu-item>
                            <el-menu-item index="/admin/handOrder" :class="$route.path=='/admin/handOrder'?'is-active':''">退单申请
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="el-icon-user"></i>设置</template>
                            <el-menu-item index="/admin/updatePassword" :class="$route.path=='/admin/updatePassword'?'is-active':''">修改密码
                            </el-menu-item>
                            <el-menu-item index="/admin/updatePhone" :class="$route.path=='/admin/updatePhone'?'is-active':''">修改手机号
                            </el-menu-item>
                            <el-menu-item index="/admin/workType" :class="$route.path=='/admin/workType'?'is-active':''">维修类别
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

    }
</script>

<style scoped>

</style>