<template>
  <div class="auth-container">
    <h2 class="auth-header">Sign in With Magic Link</h2>
    <form class="auth-form" @submit.prevent="handleMagicLink">
      <div class="input-container">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Your email"
          v-model="email"
        />
      </div>
      <div class="form-button-container">
        <button type="submit">Sign in</button>
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

    const handleMagicLink = async () => {
      try {
        // We call the signIn method from Supabase to send the magic link. We only pass it the email though.
        const { error } = await supabase.auth.signIn({
          email: email.value,
        });
        if (error) throw error;
      } catch (error) {
        alert(error.error_description || error.message);
      }
    };

    return {
      email,
      handleMagicLink,
    };
  },
};
</script>
