<template>
  <!-- Check if user is available in the store, if not show auth compoenent -->
  <Auth v-if="!store.state.user" />
  <!-- If user is available, show the app -->
  <HelloWorld v-else msg="Hello Vue 3 + Vite" />
</template>

<script>
import Auth from "./components/Auth.vue";
import HelloWorld from "./components/HelloWorld.vue";

import { store } from "./store";
import { supabase } from "./supabase";

export default {
  components: {
    HelloWorld,
    Auth,
  },
  setup() {
    // we initially verify if a user is logged in with Supabase
    store.state.user = supabase.auth.user();
    // we then set up a listener to update the store when the user changes either by logging in or out
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_OUT") {
        store.state.user = null;
      } else {
        store.state.user = session.user;
      }
    });

    return {
      store,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
