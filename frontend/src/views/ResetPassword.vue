<template>
    <div class=" mx-auto email d-flex  justify-content-center align-items-center">
<form class="d-flex flex-row" @submit.prevent="resetPassword">

<input type="password" class="form-control" placeholder="Enter your new password" v-model="password">
<button class="btn btn-info">Reset </button>
</form>

</div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
const route=useRoute()
const toast = useToast();
const password=ref("")
const token =route.params.token
console.log(token)

const resetPassword =async()=>{
   try{
    console.log("password",password.value)
    const response= await axios.put("https://chatapp-backend-production-69ae.up.railway.app/api/users/reset-password",
    {  password: password.value},
    
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    )
    toast.success(response.data.message,{timeout:1000,position:"top-right"})
   }
   catch(error){
    console.log(error);
    console.log('Reset password error:', error.response?.data?.message || error.message);
   }

}

</script>

<style scoped>
.email{
    height: 85vh;
    max-width: max-content;

}
</style>