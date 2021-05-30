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
        path: '/',
        name: '登录',
        component: Login
    },
    {
        path: '/admin/index',
        name: '管理员页面',
        component: AdminIndex
    },
    {
        path: '/worker/index',
        name: '维修人员页面',
        component: WorkerIndex
    },
    {
        path: '/user/index',
        name: '普通用户页面',
        component: UserIndex
    }
]

const router = new VueRouter({
    routes
})


router.beforeEach((to, from, next) => {
    //无需拦截的页面
    if (to.path === '/') {
        next();
    } else {
        //判断是否登录
        let loginState = sessionStorage.getItem('loginState');
        if (loginState === null || loginState === '') {
            next('/');
        } else {
            //正则表达式判断是否具有对应页面的权限
            let role = JSON.parse(sessionStorage.getItem('user')).role
            const path1 = /^\/admin\/.*$/
            const path2 = /^\/worker\/.*$/
            const path3 = /^\/user\/.*$/
            if (path1.test(to.path)) {
                var i = 0
                for (i = 0; i < role.length; i++) {
                    if (role[i] === 'admin') {
                        next()
                        break
                    }
                }
                if (i >= role.length) {
                    next('/');
                }
            } else if (path2.test(to.path)) {
                var i = 0
                for (i = 0; i < role.length; i++) {
                    if (role[i] === 'worker') {
                        next()
                        break
                    }
                }
                if (i >= role.length) {
                    next('/');
                }
            } else if (path3.test(to.path)) {
                var i = 0
                for (i = 0; i < role.length; i++) {
                    if (role[i] === 'user') {
                        next()
                        break
                    }
                }
                if (i >= role.length) {
                    next('/');
                }
            }
        }
    }
});

export default router