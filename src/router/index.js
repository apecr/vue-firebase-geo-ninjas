import Vue from 'vue';
import Router from 'vue-router';
import GMap from '@/components/home/GMap';
import Signup from '@/components/auth/Signup';
import Login from '@/components/auth/Login';
import firebase from 'firebase';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GMap',
      component: GMap,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    // check auth state of user
    const user = firebase.auth().currentUser;
    if (!user) {
      // user not signed in, proceed to Login
      return next({ name: 'Login' });
    }

    // user signed in, proceed
    return next();
  }
  return next();
});

export default router;
