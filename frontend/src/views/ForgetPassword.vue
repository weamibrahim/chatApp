<template>
  <div class="mx-auto email d-flex justify-content-center align-items-center">
    <form class="d-flex flex-row" @submit.prevent="sendEmail">
      <input
        class="form-control"
        type="email"
        placeholder="Enter your email"
        v-model="email"
      />

      <button class="btn btn-info">Send</button>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";
const toast = useToast();
const email = ref("");

const sendEmail = async () => {
  try {
    //console.log(email.value);
    const response = await axios.post(
      "https://chatapp-backend-production-69ae.up.railway.app/api/users/forgot-password",
      { email: email.value }
    );

    toast.success(response.data.message, {
      timeout: 1000,
      position: "top-right",
    });
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.email {
  height: 85vh;
  max-width: max-content;
}
</style>
