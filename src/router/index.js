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

export default router;
