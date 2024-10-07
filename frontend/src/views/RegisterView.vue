<template>
  <div class="register my-5 shadow-lg bg-body-tertiary rounded">
    <h2 class="text-center my-5">Register</h2>
    <form @submit.prevent="register" enctype="multipart/form-data" class="px-3">
      <div>
        <label>Name</label>
        <input
          class="form-control"
          type="text"
          v-model="user.name"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          class="form-control"
          type="email"
          v-model="user.email"
          placeholder="Enter your email"
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
      <div>
        <label>Profile Image</label>
        <input class="form-control" type="file" @change="handleFileUpload" />
      </div>
      <div class="d-flex justify-content-center mt-5 mb-3">
        <button type="submit" class="btn btn-info">Register</button>
      </div>
      <p class="text-center">
        If you have an account
        <router-link to="/" class="text-decoration-none">Login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive, computed } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const toast = useToast();
const router = useRouter();
const store = useStore();

const user = reactive({
  name: "",
  email: "",
  password: "",
  profileImage: null,
});

const isPasswordVisible = computed(() => store.getters.getPasswordVisible);

const togglePasswordVisibility = () => {
  store.dispatch("togglePasswordVisible");
};

const handleFileUpload = (event) => {
  user.profileImage = event.target.files[0];
};

const register = async () => {
  if (user.name && user.email && user.password && user.profileImage) {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("image", user.profileImage);

      const response = await axios.post(
        "https://chatapp-backend-production-69ae.up.railway.app/api/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message, {
        timeout: 1000,
        position: "top-right",
      });
      router.push("/");
      //console.log("Server response:", response);
    } catch (error) {
      console.error("Register request failed:", error);
      toast.error("Failed to register. Please try again.", {
        timeout: 1000,
        position: "top-left",
      });
    }
  }
};
</script>
<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
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
