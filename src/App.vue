<template>
  <button class="signout-button" @click="signOut">Sign Out</button>
  <!-- Check if user is available in the store, if not show auth compoenent -->
  <Auth v-if="!store.state.user" />
  <!-- If user is available, show the app -->
  <HelloWorld v-else msg="Hello World" />
</template>

<script>
import Auth from "./components/Auth.vue";
import HelloWorld from "./components/HelloWorld.vue";

import { store } from "./store";
import { supabase } from "./supabase";

export default {
  components: {
    Auth,
    HelloWorld,
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

    async function signOut() {
      const { error } = await supabase.auth.signOut();
    }

    return {
      store,

      signOut,
    };
  },
};
</script>

<style></style>
