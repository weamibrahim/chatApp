<script setup>
import UsersView from "./UsersView.vue";
import { ref } from "vue";
const isSidebarVisible = ref(false);

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};
</script>

<template>
  <div class="container-fluid background">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-2 d-none d-md-flex flex-column sidebar">
        <UsersView />
      </div>
      <div class="col-0 d-md-none">
        <button class="border-0 bg-white my-2" @click="toggleSidebar">
          <font-awesome-icon :icon="['fas', 'list']" class="fs-3 p-2" />
        </button>
        <div v-if="isSidebarVisible">
          <UsersView />
        </div>
      </div>
      <div class="col-md-10 col-sm-12">
        <div class="d-flex justify-content-center align-items-center h-75">
          <div class="fs-3 ">Select user to send message</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.sidebar {
  border-right: 1px solid #ddd9d4;
}
.background {
  background-image: url("https://img.freepik.com/free-photo/realistic-phone-studio-social-media-concept_23-2151459570.jpg?ga=GA1.1.1848435922.1723918661&semt=ais_hybrid");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: auto;
  min-height: 110vh;
}
</style>
