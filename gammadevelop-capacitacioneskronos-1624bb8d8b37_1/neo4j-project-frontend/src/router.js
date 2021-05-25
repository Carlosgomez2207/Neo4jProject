import Vue from 'vue';
import Router from 'vue-router';

import store from './store';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';
import WallPage from './pages/WallPage';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/register',
      component: RegisterPage,
    },
    {
      path: '/',
      component: MainPage,
      redirect: '/home',
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '/wall',
          component: WallPage,
          name: 'Wall',
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/home',
          component: HomePage,
          name: 'Home',
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth);

  if (requiresAuth) {
    if (store.getters.getAuthToken !== null) {
      next();
    } else {
      next('/login');
    }
  }

  next();
});

export default router;
