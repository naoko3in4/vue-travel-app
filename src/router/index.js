import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "@/store"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    props: true
  },
  {
    path: "/destination/:slug",
    name: "DestinationDetails",
    props: true,
    component: () => import(/* webpackChunkName: "panama" */ "../views/DestinationDetails.vue"),
    children: [
      {
        path: ":experienceSlug",
        name: "experienceDetails",
        props: true,
        component: () => import(/*webpackChunkName: "ExperienceDeteils" */ "../views/ExperienceDetails")
      }
    ],
    beforeEnter: (to,from,next) => {
      const exists = store.destinations.find(
        destination => destination.slug === to.params.slug
      )
      if(exists) {
        next()
      }
      else {
        next({ name: "notFound" })
      }
    }
  },
  {
    path: "/user",
    name: "user",
    component: () => import(/*webpackChunkName: "User" */ "../views/User"),
    //make mata field to mark the route as protected
    meta: {requiresAuth: true}
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/*webpackChunkName: "Login" */ "../views/Login")
  },
  {
    path: "/invoices",
    name: "invoices",
    component: () => import(/*webpackChunkName: "Invoices" */ "../views/Invoices"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/404",
    alias: "*",
    name: "notFound",
    component: () => import(/*webpackChunkName: "notFound" */ "../views/NotFound")
  }
];

const router = new VueRouter({
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    if(savedPosition) {
      return savedPosition
    } else {
      const position = {}
      if (to.hash) {
        position.selector = to.hash
        if (to.hash === '#experience') {
          position.offset = {y:140}
        }
        if(document.querySelector(to.hash)) {
          return position
        }
        return false
      }
    }
  },
  routes
});

// create and protect new page using Navigation Guards(ask user to authenticate)
// beforeEach is callback function which receives to, from and next arguments.
// create User page(User.vue) only user can access.
// register the route (router/index.js)
// access the meta field
// create login page(Login.vue)
router.beforeEach((to, from, next) => {
  // need to login before visiting the page
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(!store.user) {
      next({
        name: "login",
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }

  } else {
    next()
  }
})

export default router;
