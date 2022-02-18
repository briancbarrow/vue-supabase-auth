<script setup>
import { ref } from "vue";
import { supabase } from "../supabase";

defineProps({
  msg: String,
});

const count = ref(0);
async function signOut() {
  const { error } = await supabase.auth.signOut();
}
</script>

<template>
  <h1 class="hello-world">{{ msg }}</h1>

  <button class="signout-button" @click="signOut">Sign Out</button>
</template>

<style scoped></style>
