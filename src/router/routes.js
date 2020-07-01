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
        path:'*',
        redirect: {name:"Register"}
    }
]