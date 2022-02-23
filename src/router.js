// Import Vue Router
import * as VueRouter from "vue-router";

// Import the components that will show on the different routes
import PodcastFeed from "./components/PodcastFeed.vue";
import PodcastDetail from "./components/PodcastDetail.vue";

// Set up the routes
const routes = [
  { path: "/", component: PodcastFeed },
  { path: "/podcast/:id", component: PodcastDetail },
];

// Initialize the router
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

// Export the router
export default router;
