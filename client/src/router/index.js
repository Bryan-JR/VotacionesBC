import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: InicioView
  },
  {
    path: '/admin',
    name: 'InicioAdmin',
    component: () => import('../views/InicioAdminView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/usuario',
    name: 'InicioUsuario',
    component: () => import('../views/InicioUserView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/convocatorias',
    name: 'ConvocatoriasAdmin',
    component: () => import('../views/ConvocatoriasAdmin.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const log = { ...JSON.parse(localStorage.getItem("log"))};
  const isAuthenticated = log.log;
  const type = log.type;
  if(to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    if(type=="usuario" && to.path == "/admin") next('/usuario');
    else next();
  }
});

export default router;
