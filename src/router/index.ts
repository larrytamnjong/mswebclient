import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/inventory-snapshot",
    name: "inventory-snapshot",
    component: () => import("../views/InventorySnapshot.vue"),
  },
  // {
  //   path: "/locations",
  //   name: "locations",
  //   component: () => import("../views/Locations.vue"),
  // },
  {
    path: "/products",
    name: "products",
    component: () => import("../views/Products.vue"),
  },
  {
    path: "/stock-transfers",
    name: "stock-transfers",
    component: () => import("../views/StockTransfers.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
