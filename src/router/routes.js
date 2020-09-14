export const routes = [
    {
        path: '/register',
        name: 'Register',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/register.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('../views/main.vue'),
        children:[
            {
                path: 'order',
                name: 'Order',
                component: () => import('../views/mainViews/order.vue')
            },
            {
                path: 'menu',
                name: 'Menu',
                component: () => import('../views/mainViews/menu.vue'),
            },
            {
                path: 'shoppingcart',
                name: 'shoppingCart',
                component: () => import('../views/mainViews/shoppingcart.vue')
            },
            {
                path: 'mind',
                name: 'Mind',
                component: () => import('../views/mainViews/mind.vue')
            },
            
        ]
    },
    {
        path: '/details',
        name: 'Details',
        component: () => import('../views/details.vue')
    },
    {
        path: '/address',
        name: 'Address',
        component: () => import('../views/address.vue')
    },
    {
        path: '/createAddress',
        name: 'CreateAddress',
        component: () => import('../views/createAddress.vue')
    },
    {
        path: '/submit',
        name: 'Submit',
        component: () => import('../views/submit.vue')
    },
    {
        path: '/mycollect',
        name: 'MyCollect',
        component: () => import('../views/mycollect.vue')
        
    },
    {
        path: '/securecenter',
        name: 'SeureCenter',
        component: () => import('../views/securecenter.vue')
        
    },

    {
        path: '/countManage',
        name: 'CountManage',
        component: () => import('../views/countManage.vue')
        
    },
    {
        path: '/forgetpwd',
        name: 'forgetPwd',
        component: () => import('../views/forgetpwd.vue')
    },
    
    {
        path:'*',
        redirect: {name:"Menu"}
    }
]