import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta:{requiresAuth:true}
      
    }
    ,
    {
      path: '/',
      name: 'login',
     
      component: () => import('../views/LoginView.vue')
    },{
      path: '/register',
      name: 'register',
    
      component: () => import('../views/RegisterView.vue')
    },
    {
      path:'/updateProfile',
      name:'updateProfile',
      component:() => import('../views/UpdateProfileView.vue')
      ,meta:{requiresAuth:true}
    }
    ,
    {path:'/chat/:id',
      component:() => import('../views/ChatView.vue')
    ,meta:{requiresAuth:true}
  },
  ,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/' 
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: () => import('../views/ForgetPassword.vue')
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      component: () => import('../views/ResetPassword.vue')
    }

  ]
})


router.beforeEach((to, from, next) => {
  const isLoggedIn =store.state.IsLogin;

  if (to.matched.some(record => record.meta.requiresAuth)) {
  
    if (!isLoggedIn) {
      next({ name: 'login' }); 
    } else {
      next(); 
    }
  } else {
    next(); 
  }
});

export default router
