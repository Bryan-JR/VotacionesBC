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
    path: '/convocatorias',
    name: 'Convocatorias',
    component: () => import('../views/ConvocatoriasView.vue'),
  },
  {
    path: '/convocatorias/:id',
    name: 'ConvocatoriaInfo',
    component: () => import('../views/ParticipaConvocatoria.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/postulados/:idCon',
    name: 'VerPostulados',
    component: () => import('../views/PostuladosView.vue'),
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const log = await { ...JSON.parse(localStorage.getItem("log"))};
  const isAuthenticated = log.log;
  const type = log.type;
  if(to.meta.requiresAuth && !isAuthenticated) next('/');
  else if (to.path=="/"&&isAuthenticated) next('/'+type);
  else {
    if(type=="usuario" && to.path == "/admin") next('/usuario');
    else next();
  }
});

export default router;
