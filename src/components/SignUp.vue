<template>
  <div class="auth-container">
    <h2 class="auth-header">Sign up for an account</h2>
    <form class="auth-form" @submit.prevent="handleSignup">
      <div class="input-container">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Your email"
          v-model="email"
        />
      </div>
      <div class="input-container">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" />
      </div>
      <div class="form-button-container">
        <button type="submit">Sign up</button>
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

    const handleSignup = async () => {
      try {
        // Use the Supabase provided method to handle the signup
        const { error } = await supabase.auth.signUp({
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
      handleSignup,
    };
  },
};
</script>
