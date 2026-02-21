import { createRouter, createWebHistory } from "vue-router"
import HomePage from "./routes/HomePage.vue"
import LobbyPage from "./routes/LobbyPage.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/lobby/:roomCode?", component: LobbyPage },
  ],
})

export default router
