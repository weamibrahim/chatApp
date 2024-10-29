<template>
  <div class="login my-5 shadow-lg bg-body-tertiary rounded">
    <h2 class="text-center my-5">Login</h2>
    <form class="px-5" @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input
          type="email"
          v-model="user.email"
          placeholder="Enter your username"
          class="form-control"
        />
      </div>
      <div>
        <label for="password">Password</label>
        <div class="password-wrapper">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="user.password"
            placeholder="Enter your password"
            class="form-control password-input"
          />
          <span class="password-toggle-icon" @click="togglePasswordVisibility">
            {{ isPasswordVisible ? "🙈" : "👁️" }}
          </span>
        </div>
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
      <p class="text-center">
        <router-link to="/forgetPassword" class="text-decoration-none"
          >Forget Password</router-link
        >
      </p>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive, computed } from "vue";
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

const isPasswordVisible = computed(() => store.getters.getPasswordVisible);
//console.log(isPasswordVisible);
const togglePasswordVisibility = () => {
  store.dispatch("togglePasswordVisible");
};
const login = async () => {
  if (user.email && user.password) {
    //console.log("Sending request to the server with payload:", user);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",

        user
      );
      //console.log("Server response:", response);
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
        position: "top-left",
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
.password-wrapper {
  position: relative;
}
.password-toggle-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
