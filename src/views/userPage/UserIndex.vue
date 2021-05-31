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
                    <el-menu :default-openeds="['1','2']" router>
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-user"></i>工单管理</template>
                            <el-menu-item index="/user/order" :class="$route.path=='/user/order'?'is-active':''">我的工单
                            </el-menu-item>
                            <el-menu-item index="/user/addOrder" :class="$route.path=='/user/addOrder'?'is-active':''">新建工单
                            </el-menu-item>
                            <el-menu-item index="/user/test" :class="$route.path=='/user/test'?'is-active':''">测试
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-user"></i>设置</template>
                            <el-menu-item index="/user/UpdatePassword" :class="$route.path=='/user/UpdatePassword'?'is-active':''">修改密码
                            </el-menu-item>
                            <el-menu-item index="/user/updatePhone" :class="$route.path=='/user/updatePhone'?'is-active':''">修改手机号
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