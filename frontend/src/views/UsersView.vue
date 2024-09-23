<template>
  <div>
    <input
      type="text"
      v-model="search"
      class="form-control my-3"
      placeholder="Search"
    />

    <div v-for="user in filterUsers" :key="user._id">
      <div @click="goToChat(user)" class="d-flex align-items-center my-3">
        <div class="position-relative">
          <img :src="user.profileImage" />
          <div
            :class="{
              'mark-green': user.status === 'online',
              'mark-red': user.status === 'offline',
            }"
            class="status-indicator position-absolute"
          ></div>
        </div>
        <div class="mx-3 pe-none">{{ user.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import io from "socket.io-client";

const search = ref("");
const socket = io("https://chat-app-one-rose-29.vercel.app");
const users = ref([]);
const store = useStore();
const router = useRouter();

const fetchUsers = async () => {
  await store.dispatch("fetchUsers");
  users.value = store.getters.getUsers;
};
const filterUsers = computed(() => {
  //       if (!search.value.trim()) {
  //   return [];  // Return an empty array if search is empty
  // }
  return users.value.filter((user) => {
    return user.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

onMounted(async () => {
  await fetchUsers();
  console.log(users.value);

  const userId = store.getters.getUserInfo._id;
  socket.emit("join", userId);
  socket.on("updateUserStatus", (updatedUser) => {
    const user = users.value.find((u) => u._id === updatedUser.userId);
    if (user) {
      user.status = updatedUser.status;
    }
  });
});

const goToChat = (user) => {
  router.push(`/chat/${user._id}`);
};
</script>

<style scoped>
img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  right: 5px;
  bottom: 40px;
}
.mark-green {
  background-color: green;
}
.mark-red {
  background-color: red;
}
</style>
