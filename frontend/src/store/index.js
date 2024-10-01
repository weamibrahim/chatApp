import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    users: [],
    user: {},
    messages: [],
    token: localStorage.getItem("token") || null,
    userInfo: JSON.parse(localStorage.getItem("user")) || null,
    IsLogin: false,
    passwordVisible: false,
  },
  getters: {
    getUsers(state) {
      return state.users;
    },
    getOneUser(state) {
      return state.user;
    },
    getMessages(state) {
      return state.messages;
    },
    getToken(state) {
      return state.token;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getPasswordVisible(state) {
      return state.passwordVisible;
    },
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setOneUser(state, user) {
      state.user = user;
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
    setLogin(state, isLoggedIn) {
      state.IsLogin = isLoggedIn;
      console.log(state.IsLogin);
    },
    setPasswordVisible(state) {
      state.passwordVisible = !state.passwordVisible;
    }
  },
  actions: {
    async fetchUsers({ commit }) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user._id;
        const res = await axios(
          `https://chatapp-backend-production-69ae.up.railway.app/api/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.token}`,
            },
          }
        );
        commit("setUsers", res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    async fetchOneUser({ commit }, receiverId) {
      try {
        const res = await axios(
          `https://chatapp-backend-production-69ae.up.railway.app/api/users/user/${receiverId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.token}`,
            },
          }
        );
        commit("setOneUser", res.data);
      } catch (error) {
        console.error("Failed to fetch the user:", error);
      }
    },
    async fetchMessages({ commit }, { senderId, receiverId }) {
      try {
        const res = await axios(
          `https://chatapp-backend-production-69ae.up.railway.app/api/messages/${senderId}/${receiverId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.token}`,
            },
          }
        );
        commit("setMessages", res.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    },
    async checkLogin({ commit }, isLoggedIn) {
      commit("setLogin", isLoggedIn);
    }, 
    async togglePasswordVisible({ commit }) {
      commit("setPasswordVisible");
    },
  },

  modules: {},
});
