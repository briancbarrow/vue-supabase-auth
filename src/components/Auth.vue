<template>
  <div class="auth">
    <!-- v-if logic to determine which auth component to show -->
    <sign-up v-if="isSignUp && !useMagicLink" />
    <sign-in v-else-if="!isSignUp && !useMagicLink" />
    <magic-link v-else />
    <div v-if="!useMagicLink">
      <button v-if="!useMagicLink" @click="isSignUp = !isSignUp">
        {{
          isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account yet? Sign Up"
        }}
      </button>
      <p>Or</p>
    </div>
    <button @click="toggleMagicLink">
      {{
        useMagicLink
          ? "Sign in with email and password"
          : "Sign in with magic link"
      }}
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import SignUp from "./SignUp.vue";
import SignIn from "./SignIn.vue";
import MagicLink from "./MagicLink.vue";
export default {
  components: { SignUp, SignIn, MagicLink },
  setup() {
    const isSignUp = ref(true);
    const useMagicLink = ref(false);

    function toggleMagicLink() {
      useMagicLink.value = !useMagicLink.value;
    }

    return {
      isSignUp,
      useMagicLink,

      toggleMagicLink,
    };
  },
};
</script>

<style scoped></style>
