import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'

const routerOptions = [
  { path: '/', component: 'Landing' },
  { path: '/signin', component: 'Signin' },
  { path: '/home', component: 'Home', requiresAuth: true },
  { path: '/tourlist', component: 'TourList', requiresAuth: true },
  { path: '/tourcreate', component: 'TourCreate', requiresAuth: true },
  { path: '/touredit/:doc_id', component: 'TourEdit', requiresAuth: true },
  { path: '*', component: 'NotFound' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/views/${route.component}.vue`)
  }
})

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = firebase.auth().currentUser
  if (requiresAuth && !isAuthenticated) {
    // next('/signin')
    next()
  } else {
    next()
  }
})

export default router
