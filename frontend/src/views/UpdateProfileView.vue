<template>
  <div>
    <button
      type="button"
      class="border-0 bg-body-tertiary my-2"
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
    >
      <img
        :src="infOfUser.profileImage"
        style="width: 40px; height: 40px; border-radius: 50%"
      />
    </button>
    <!-- Modal -->
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              My profile
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            <div><img :src="infOfUser.profileImage" class="image" /></div>
            <form @submit.prevent="updateProfile" enctype="multipart/form-data">
              <div class="row my-3">
                <label for="name" class="col-sm-2 col-form-label">Name:</label>
                <div class="col-sm-10">
                  <input
                    type="text"
                    id="name"
                    v-model="infOfUser.name"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="row my-3">
                <label for="email" class="col-sm-2 col-form-label"
                  >Email:</label
                >
                <div class="col-sm-10">
                  <input
                    type="email"
                    id="email"
                    v-model="infOfUser.email"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="row my-3">
                <label for="profileImage" class="col-sm-2 col-form-label"
                  >Image:</label
                >
                <div class="col-sm-10">
                  <input
                    type="file"
                    class="form-control"
                    @change="onFileChange"
                  />
                </div>
              </div>
              <div class="modal-footer d-flex justify-content-center">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
const toast = useToast();

const store = useStore();
const token = store.getters.getToken;

let infOfUser = JSON.parse(localStorage.getItem("user"));
console.log(infOfUser);

const onFileChange = (event) => {
  const profileImage = event.target.files[0];
  if (profileImage) {
    infOfUser.profileImage = profileImage;
  }
};

const updateProfile = async () => {
  const formData = new FormData();
  formData.append("name", infOfUser.name);
  formData.append("email", infOfUser.email);
  if (infOfUser.profileImage) {
    formData.append("image", infOfUser.profileImage); // Now directly using infOfUser.profileImage
  }

  try {
    const data = await axios.put(
      `https://chat-app-one-rose-29.vercel.app/api/users/${infOfUser._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(data.data.updatedUser);
    localStorage.setItem("user", JSON.stringify(data.data.updatedUser));
    toast.success(data.data.message, {
      timeout: 1000,
      position: "top-left",
    });
  } catch (error) {
    console.error(error);
    toast.error("Failed to update profile. Please try again.", {
      timeout: 1000,
      position: "top-left",
    });
  }
};
</script>

<style scoped>
.image {
  width: 30%;
  height: 30%;
  border-radius: 80%;
}
</style>
