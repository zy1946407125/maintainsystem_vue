import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";

//管理员页面
import AdminIndex from "../views/adminPage/AdminIndex";


//维修人员页面
import WorkerIndex from "../views/workerPage/WorkerIndex";


//普通用户页面
import UserIndex from "../views/userPage/UserIndex";

Vue.use(VueRouter)

const routes = [
    {
        path: '',
        name: '登录',
        component: Login
    },
    {
        path: '/adminIndex',
        name: '管理员页面',
        component: AdminIndex
    },
    {
        path: '/workerIndex',
        name: '维修人员页面',
        component: WorkerIndex
    },
    {
        path: '/userIndex',
        name: '普通用户页面',
        component: UserIndex
    }
]

const router = new VueRouter({
    routes
})

export default router
