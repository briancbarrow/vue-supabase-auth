<script setup>
import { ref } from "vue";
import { supabase } from "../supabase";

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <h1 class="hello-world">{{ msg }}</h1>
</template>

<style scoped></style>
