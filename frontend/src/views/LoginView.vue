<template>
  <div class="login my-5 shadow-lg bg-body-tertiary rounded">
    <h2 class="text-center my-5">Login</h2>
    <form class="px-5" @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input
          v-model="user.email"
          placeholder="Enter your username"
          class="form-control"
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          v-model="user.password"
          placeholder="Enter your password"
          class="form-control"
        />
      </div>
      <div class="d-flex justify-content-center my-5">
        <button class="btn btn-info">Login</button>
      </div>
      <p>
        If you don't have an account
        <router-link to="/register" class="text-decoration-none"
          >Register</router-link
        >
      </p>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
const toast = useToast();
const router = useRouter();
const store = useStore();
const user = reactive({
  email: "",
  password: "",
});

const login = async () => {
  if (user.email && user.password) {
    console.log("Sending request to the server with payload:", user);
    try {
      const response = await axios.post(
        "https://chat-app-gamma-snowy.vercel.app/api/users/login",
        user
      );
      console.log("Server response:", response);

      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      store.dispatch("checkLogin", true);

      router.push("/home");
      toast.success("Login successful!", {
        timeout: 1000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Login request failed:", error);
      toast.error("Invalid email or password. Please try again.", {
        timeout: 1000,
        position: "top-right",
      });
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 400px;

  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
input,
button {
  margin-bottom: 10px;
  padding: 10px;
}
</style>
