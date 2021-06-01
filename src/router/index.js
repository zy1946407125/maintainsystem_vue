import Vue from 'vue'
import VueRouter from 'vue-router'

//公共页面
import Login from "../views/Login";
import Register from "../views/Register";
import UpdatePassword from "../views/UpdatePassword";
import UpdatePhone from "../views/UpdatePhone";


//管理员页面
import AdminIndex from "../views/adminPage/AdminIndex";
import WorkType from "../views/adminPage/WorkType";
import Order from "../views/adminPage/Order";
import SendOrder from "../views/adminPage/SendOrder";
import HandOrder from "../views/adminPage/HandOrder";
import ChooseWorker from "../views/adminPage/ChooseWorker";
import Admins from "../views/adminPage/Admins";
import Workers from "../views/adminPage/Workers";

//维修人员页面
import WorkerIndex from "../views/workerPage/WorkerIndex";
import WorkerOrder from "../views/workerPage/WorkerOrder";
import ConfirmOrder from "../views/workerPage/ConfirmOrder";
import MaintainOrder from "../views/workerPage/MaintainOrder";

//普通用户页面
import UserIndex from "../views/userPage/UserIndex";
import UserOrder from "../views/userPage/UserOrder";
import AddOrder from "../views/userPage/AddOrder";
import UserMaintainOrder from "../views/userPage/UserMaintainOrder";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '登录',
        component: Login
    },
    {
        path: '/register',
        name: '注册',
        component: Register
    },
    {
        path: '/admin/index',
        name: '管理员--人员管理',
        component: AdminIndex,
        children:[
            {
                path: '/admin/selectAdmins',
                name: '管理员列表',
                component: Admins,
            },
            {
                path: '/admin/selectWorkers',
                name: '维修人员列表',
                component: Workers,
            },
        ]
    },
    {
        path: '/admin/index',
        name: '管理员--工单管理',
        component: AdminIndex,
        children:[
            {
                path: '/admin/order',
                name: '工单查询',
                component: Order,
            },
            {
                path: '/admin/sendOrder',
                name: '工单指派',
                component: SendOrder,
            },
            {
                path:'/admin/handOrder',
                name:'退单申请',
                component: HandOrder
            },
            {
                path:'/admin/chooseWorker',
                name:'选择工人',
                component: ChooseWorker
            },
        ]
    },
    {
        path: '/admin/index',
        name: '管理员--设置',
        component: AdminIndex,
        children:[
            {
                path: '/admin/updatePassword',
                name: '修改密码',
                component: UpdatePassword,
            },
            {
                path: '/admin/updatePhone',
                name: '修改手机号',
                component: UpdatePhone,
            },
            {
                path:'/admin/workType',
                name:'维修类别',
                component: WorkType
            }
        ]
    },
    {
        path: '/worker/index',
        name: '维修人员--工单管理',
        component: WorkerIndex,
        children:[
            {
                path: '/worker/order',
                name: '我的工单',
                component: WorkerOrder,
            },
            {
                path: '/worker/confirmOrder',
                name: '工单确认',
                component: ConfirmOrder,
            },
            {
                path: '/worker/maintainOrder',
                name: '正在维修',
                component: MaintainOrder,
            },
        ]
    },
    {
        path: '/worker/index',
        name: '维修人员--设置',
        component: WorkerIndex,
        children:[
            {
                path: '/worker/updatePassword',
                name: '修改密码',
                component: UpdatePassword,
            },
            {
                path: '/worker/updatePhone',
                name: '修改手机号',
                component: UpdatePhone,
            },
        ]
    },
    {
        path: '/user/index',
        name: '普通用户--工单管理',
        component: UserIndex,
        children:[
            {
                path: '/user/order',
                name: '我的工单',
                component: UserOrder,
            },
            {
                path: '/user/maintainOrder',
                name: '维修完成',
                component: UserMaintainOrder,
            },
            {
                path: '/user/addOrder',
                name: '新建工单',
                component: AddOrder,
            },
        ]
    },
    {
        path: '/user/index',
        name: '普通用户--设置',
        component: UserIndex,
        children:[
            {
                path: '/user/updatePassword',
                name: '修改密码',
                component: UpdatePassword,
            },
            {
                path: '/user/updatePhone',
                name: '修改手机号',
                component: UpdatePhone,
            },
        ]
    }
]

const router = new VueRouter({
    routes
})


router.beforeEach((to, from, next) => {
    //无需拦截的页面
    if (to.path === '/' || to.path === '/register') {
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
