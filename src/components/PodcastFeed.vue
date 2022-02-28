<template>
  <div class="podcast-input-feed">
    <label for="email">Podcast RSS Feed URL</label>
    <div class="">
      <input
        type="url"
        name="url"
        id="url"
        v-model="url"
        placeholder="https://rss.your-org.org/feed/"
        aria-describedby="rss-url"
      />
    </div>
    <button @click="getRssFeed()" type="button" class="">Get Feed</button>
    <podcast-info v-if="podcast.title && !requestError" :podcast="podcast" />
  </div>
  <!-- Loop through podcasts and display them -->
  <div class="feeds">
    <h2 class="">Your Podcast Feeds</h2>
    <ul class="">
      <li v-for="pod in store.state.podcasts" :key="pod.id" class="">
        <a :href="`/podcast/${pod.id}`" class="">
          <img :src="pod.image_url" :alt="`logo for ${pod.name}`" class="" />
          <p class="">{{ pod.name }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "../supabase";
import { store } from "../store";

import PodcastInfo from "./PodcastInfo.vue";

export default {
  components: {
    PodcastInfo,
  },

  setup() {
    // I am initializing the url to a url I know works, so that I don't need to keep inputing a url as I'm developing.
    // feel free to change this to a url of your own choosing
    // const url = ref("https://anchor.fm/s/3e9db190/podcast/rss");
    const url = ref("https://feeds.simplecast.com/kwWc0lhf");
    // initializing the podcast state to an empty object
    const podcast = ref({});
    const requestError = ref(false);

    function getRssFeed() {
      const feedUrl = url.value;
      return (
        fetch(feedUrl)
          // this returns a promise so we need to convert it to a string
          .then((response) => response.text())
          // this next line is to parse the xml response
          .then((str) =>
            new window.DOMParser().parseFromString(str, "text/xml")
          )
          // parsing the data from the xml response and setting it into the podcast state
          .then((data) => {
            console.log("Data: ", data);
            podcast.value.image_url = data
              .querySelector("image")
              .querySelector("url").innerHTML;
            podcast.value.title = data.querySelector("title").textContent;
            podcast.value.description =
              data.querySelector("description").textContent;
            podcast.value.rss_url = feedUrl;
          })
          .catch((err) => {
            requestError.value = true;
          })
      );
    }
    return {
      url,
      podcast,
      store,
      requestError,

      getRssFeed,
    };
  },
};
</script>
