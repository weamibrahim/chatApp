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

      <!-- Chat Area -->
      <div class="col-md-10 col-sm-12">
        <div class="chat">
          <h2 class="my-3 text-center" style="font-family: Sofia, sans-serif">
            To {{ recipientName }}
          </h2>
          <div
            v-if="isTyping"
            class="fs-4 my-2"
            style="font-family: Sofia, sans-serif"
          >
            {{ recipientName }} is typing

            <span class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>

          <div class="messages" ref="messagesContainer">
            <div
              v-for="message in messages"
              :key="message._id"
              class="message-container"
              :class="{
                'message-sent': message.senderId._id === userId,
                'message-received': message.senderId._id !== userId,
              }"
            >
              <div class="message-content">
                <p>{{ message.message }}</p>
              </div>
              <img
                :src="
                  message.senderId._id === userId
                    ? store.getters.getUserInfo.profileImage
                    : message.senderId.profileImage
                "
                alt="Profile"
                class="profile-image mx-2"
              />
            </div>
          </div>

          <div class="message-input">
            <input
              v-model="message"
              placeholder="Type a message..."
              @keyup.enter="sendMessage"
              @input="onTyping"
            />
            <button @click="sendMessage" class="ms-1">
              <font-awesome-icon :icon="['fas', 'paper-plane']" class="fs-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UsersView from "./UsersView.vue";
import notification from "@/assets/notification.mp3"
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { io } from "socket.io-client";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();

const userId = store.getters.getUserInfo._id;
console.log(userId);
const recipientId = ref(route.params.id || null);
const recipientName = ref("");

const message = ref("");
const messages = ref([]);
const messagesContainer = ref(null);

let socket = null;
const isSidebarVisible = ref(false);
const isTyping = ref(false);
let typingTimeout = null;

const audio = new Audio(notification);


const playAudio = () => {
  audio.play();
}

const onTyping = () => {
  socket.emit("typing", { receiverId: recipientId.value });
};
// Toggle sidebar
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};
// Fetch recipient name
const fetchUser = async () => {
  await store.dispatch("fetchOneUser", recipientId.value);
  recipientName.value = store.getters.getOneUser.name;
};

// Fetch old messages
const getAllMessages = async () => {
  try {
    if (!recipientId.value) return;
    await store.dispatch("fetchMessages", {
      senderId: userId,
      receiverId: recipientId.value, // Access recipientId.value
    });
    messages.value = store.getters.getMessages;
    scrollToBottom();
  } catch (err) {
    console.error("Failed to load messages:", err.message);
  }
};

// Send message
const sendMessage = () => {
  if (message.value.trim() === "" || !recipientId.value) return;

  const messageData = {
    senderId: userId,
    receiverId: recipientId.value,
    message: message.value,
  };

  socket.emit("sendMessage", messageData);
  playAudio();
  message.value = "";
  scrollToBottom();
};

// Handle new message
const handleNewMessage = (msg) => {
  messages.value.push(msg);
  getAllMessages();
  scrollToBottom();
};

// Scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    const container = messagesContainer.value;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

watch(
  () => route.params.id,
  async (newId) => {
    recipientId.value = newId;
    await fetchUser();
    await getAllMessages();
    socket.emit("join", userId);
  }
);

onMounted(async () => {
  if (!recipientId.value) return;

  await fetchUser();
  socket = io("https://chatapp-backend-production-69ae.up.railway.app");

  socket.emit("join", userId);

  socket.on("userTyping", () => {
    isTyping.value = true;

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      isTyping.value = false;
    }, 1000);
  });

  socket.on("newMessage", (message) => {
    handleNewMessage(message);
    playAudio();
  });

  await getAllMessages();
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});
</script>

<style scoped>
.background {
  background-image: url("https://img.freepik.com/free-photo/realistic-phone-studio-social-media-concept_23-2151459570.jpg?ga=GA1.1.1848435922.1723918661&semt=ais_hybrid");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: auto;
}
.sidebar {
  border-right: 1px solid #ddd9d4;
}
.chat {
  display: flex;
  flex-direction: column;
  height: 90vh;
  max-width: 600px;
  margin: 0 auto;
}

.messages {
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  flex-grow: 1;
  overflow-y: auto; 
  padding: 10px;
  background-color: #f9f9f98c;
  max-height: calc(90vh - 150px);
}

.message-container {
  display: flex;
  margin-bottom: 10px;
  width: 100%;
}
.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.message-sent .profile-image {
  order: -1;

  margin-right: 0;
}

.message-sent {
  justify-content: flex-start;
}

.message-received {
  justify-content: flex-end;
}

.message-content {
  background-color: #ececec;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.message-sent .message-content {
  background-color: #f05a7e;
  color: white;
  border-top-right-radius: 0;
}

.message-received .message-content {
  background-color: #93d9e3;
  color: black;
  border-top-left-radius: 0;
}

.message-input {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 5px;
}

.message-input input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.message-input button {
  background-color: #125b9a;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 5px 15px;
  cursor: pointer;
}

.message-input button:hover {
  background-color: #e95264;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 2px;
  border-radius: 50%;
  background-color: #0a0a0a;
  animation: typing 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>
