import Vue from "vue"
import VueRouter from "vue-router"
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: "/",
    name: "items",
    component: () => import("../views/Items.vue"),
  },
  {
    path: "/items/:_id/annotate",
    name: "annotate",
    component: () => import("../views/Annotate.vue"),
  },
  {
    path: "/camera",
    name: "annotate",
    component: () => import("../views/Camera.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
