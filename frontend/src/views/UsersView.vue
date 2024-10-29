<template>
  <div>
    <input
      type="text"
      v-model="search"
      class="form-control my-3"
      placeholder="Search"
    />

    <div v-for="users in filterUsers" :key="users.user._id">
      <div @click="goToChat(users.user)" class="d-flex my-3">
        <div class="position-relative">
          <img :src="users.user.profileImage" />
          <div
            :class="{
              'mark-green': users.user.status === 'online',
              'mark-red': users.user.status === 'offline',
            }"
            class="status-indicator position-absolute"
          ></div>
        </div>
        <div class="mx-3 pe-none">
          <div>{{ users.user.name }}</div>
          <div class="ms-auto pe-3 text-muted block text-break">
            {{
              users.lastMessage ? users.lastMessage.message : "No messages yet"
            }}
          </div>
        </div>
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
const socket = io("https://chatapp-backend-production-69ae.up.railway.app");

const users = ref([]);
const store = useStore();
const router = useRouter();

let infOfUser = JSON.parse(localStorage.getItem("user"));
const userId = infOfUser._id;

const fetchUsers = () => {
  users.value = [];
  socket.emit("getusers", userId);
};

const filterUsers = computed(() => {
  return users.value.filter(({ user }) => {
    return user.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

onMounted(async () => {
  await fetchUsers();

  socket.emit("join", userId);
  socket.on("updateUserStatus", (updatedUser) => {
    const user = users.value.find((u) => u.user._id === updatedUser.userId);
    if (user) {
      user.user.status = updatedUser.status;
    }
  });

  socket.on("users", (userWithLastMessages) => {
    console.log(userWithLastMessages);
    users.value = userWithLastMessages;
  });

  socket.on("updateLastMessage", ({ user, lastMessage }) => {
    const existingUser = users.value.find((u) => u.user._id === user._id);
    if (existingUser) {
      existingUser.lastMessage = lastMessage;
    } else {
      users.value.push({ user, lastMessage });
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
