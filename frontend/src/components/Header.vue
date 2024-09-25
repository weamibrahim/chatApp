<template>
  <div>
    <div class="bg-body-tertiary">
      <div
        class="d-flex justify-content-between container-fluid align-items-center"
      >
        <div class="font-bold fs-3 my-2">
          <img
            src="../assets/logo.jpg"
            style="width: 50px; height: 50px; border-radius: 50%"
          />
          <RouterLink to="/home" class="text-decoration-none text-dark">
            chatApp
          </RouterLink>
        </div>
        <div class="my-2" v-if="!store.state.IsLogin">
          <RouterLink
            to="/register"
            class="text-decoration-none text-dark fs-4 mx-2"
          >
            register</RouterLink
          >
          <RouterLink to="/" class="text-decoration-none text-dark fs-4"
            >login</RouterLink
          >
        </div>
        <div class="my-2 d-flex align-items-center" v-if="store.state.IsLogin">
          <UpdateProfileView class="mx-2 d-inline" />
          <button class="border-0 bg-body-tertiary d-inline" @click="logout">
            <font-awesome-icon
              :icon="['fas', 'right-from-bracket']"
              class="fs-3"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import io from "socket.io-client";
import UpdateProfileView from "@/views/UpdateProfileView.vue";
const store = useStore();
const router = useRouter();

const token = store.getters.getToken;
const socket = io("https://chatapp-backend-production-69ae.up.railway.app");

const storedUser = localStorage.getItem("user");
const userId = storedUser ? JSON.parse(storedUser)._id : null;

if (userId) {
  socket.emit("join", userId);
} else {
  console.log("User not logged in");
}

if (token) {
  store.dispatch("checkLogin", true);
} else {
  store.dispatch("checkLogin", false);
}

const logout = () => {
  socket.emit("logout", userId);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  store.dispatch("checkLogin", false);
  router.push("/login");
};
</script>

<style></style>
