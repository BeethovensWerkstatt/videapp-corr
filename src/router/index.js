import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/works',
    name: 'Werke',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "videapp" */ '../views/WorksList.vue')
  },
  {
    path: '/modules',
    name: 'Module',
    component: () => import(/* webpackChunkName: "videapp" */ '../views/Modules.vue')
  },
  {
    path: '/work/:id',
    name: 'Schreibtisch',
    component: () => import(/* webpackChunkName: "videapp" */ '../views/Desktop.vue')
  },
  {
    path: '/complaints/:id?',
    name: 'Monita',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "videapp" */ '../views/ComplaintsList.vue')
  }
]

const router = new VueRouter({
  // mode: 'history', // nice, but needs server config
  routes
})

export default router
