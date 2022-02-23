<template>
  <div class="auth-container">
    <h2 class="auth-header">Sign in to your account</h2>
    <form class="auth-form" @submit.prevent="handleSignin">
      <div class="input-container">
        <label for="email" class=""> Email address </label>
        <input class="" type="email" placeholder="Your email" v-model="email" />
      </div>
      <div class="input-container">
        <label for="password" class=""> Password </label>
        <input
          type="password"
          class=""
          placeholder="Your password"
          v-model="password"
        />
      </div>
      <div class="form-button-container">
        <button type="submit" class="">Sign in</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "../supabase";

export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const handleSignin = async () => {
      try {
        // Use the Supabase provided method to handle the signin
        const { error } = await supabase.auth.signIn({
          email: email.value,
          password: password.value,
        });
        if (error) throw error;
      } catch (error) {
        alert(error.error_description || error.message);
      }
    };

    return {
      email,
      password,
      handleSignin,
    };
  },
};
</script>
