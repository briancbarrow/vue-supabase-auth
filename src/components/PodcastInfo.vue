<template>
  <div class="podcast-info">
    <div class="image-container">
      <img :src="podcast.image_url" alt="" class="" />
    </div>
    <div class="podcast-text">
      <div class="title-desc">
        <p class="title">
          {{ podcast.title }}
        </p>
        <p class="desc">
          {{ podcast.description }}
        </p>
      </div>
    </div>
    <!-- Add check in markup to remove the button if the podcast already exists in the user's list -->
    <div v-if="isInUserPodcasts" class="in-podcasts">In Your Podcasts</div>
    <button v-else class="" @click="addPodcast">Add to My Podcasts</button>
  </div>
</template>

<script>
// importing computed
import { ref, computed } from "vue";
import { store } from "../store";
import { supabase } from "../supabase";

export default {
  props: {
    podcast: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // add computed property checking if podcast is in user's podcasts
    const isInUserPodcasts = computed(() => {
      return store.state.podcasts.some(
        (podcast) => podcast.rss_url === props.podcast.rss_url
      );
    });

    function addPodcast() {
      // check if podcast is already in user's podcasts
      if (isInUserPodcasts.value) {
        alert("You already have this podcast in your list!");
      } else {
        const podcast = {
          name: props.podcast.title,
          image_url: props.podcast.image_url,
          description: props.podcast.description,
          rss_url: props.podcast.rss_url,
          user_id: store.state.user.id,
        };
        supabase
          .from("podcasts")
          .insert(podcast)
          .then(({ body }) => {
            store.addPodcastToStore(body[0]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    return {
      isInUserPodcasts,
      addPodcast,
    };
  },
};
</script>

<style scoped></style>
