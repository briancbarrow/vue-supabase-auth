<template>
  <nav class="">
    <a href="/" class="">Home</a>
  </nav>
  <!-- Basic layout for showing podcast info -->
  <div class="podcast-detail">
    <img :src="podcast.image_url" :alt="podcast.name" class="" />
    <h1 class="">{{ podcast.name }}</h1>
    <p>{{ podcast.description }}</p>
    <h2 class="">Episodes</h2>
    <!-- Looping through each episode of a podcast and displaying episode info -->
    <ul class="">
      <li
        v-for="episode in episodes"
        :key="episode.guid || episode.link"
        class=""
      >
        <div class="info">
          <h3>{{ episode.title }}</h3>
          <audio class="" controls>
            <source :src="episode.url" type="audio/mpeg" />
            Display
          </audio>
          <button
            v-if="savedTranscriptions[`${podcast.id}---${episode.guid}`]"
            disabled
          >
            Transcription Saved
          </button>
          <button
            v-else-if="
              !transcriptions[`${podcast.id}---${episode.guid}`] &&
              !savedTranscriptions[`${podcast.id}---${episode.guid}`]
            "
            @click.prevent="getTranscription(episode)"
            class=""
          >
            {{
              episodeTranscriptionLoading.includes(episode.guid)
                ? "Loading..."
                : "Get Transcription"
            }}
          </button>
          <button
            v-if="
              transcriptions[`${podcast.id}---${episode.guid}`] &&
              !savedTranscriptions[`${podcast.id}---${episode.guid}`]
            "
            class="save"
            @click.prevent="saveTranscription(podcast.id, episode.guid)"
          >
            Save Transcription
          </button>
        </div>
        <div
          v-if="savedTranscriptions[`${podcast.id}---${episode.guid}`]"
          class="transcription"
        >
          <p>
            {{ savedTranscriptions[`${podcast.id}---${episode.guid}`] }}
          </p>
        </div>
        <div
          v-else-if="transcriptions[`${podcast.id}---${episode.guid}`]"
          class="transcription"
        >
          <p>
            {{
              transcriptions[`${podcast.id}---${episode.guid}`].channels[0]
                .alternatives[0].transcript
            }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// Importing necessary methods
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../supabase";
import { store } from "../store";
import deepgram from "../deepgram";

export default {
  setup() {
    const route = useRoute();
    const podcast = ref({});
    const episodes = ref([]);
    let transcriptions = ref({});
    let savedTranscriptions = ref({});
    const episodeTranscriptionLoading = ref([]);

    // Getting podcast info from the database
    async function getPodcastData() {
      const {
        data: [podcastinfo],
      } = await supabase.from("podcasts").select().eq("id", route.params.id);
      podcast.value = podcastinfo;

      // Making call to episode url to get episode info
      getEpisodes(podcastinfo.rss_url);
      await getTranscriptions();
    }

    function getEpisodes(url) {
      fetch(url)
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
        .then((data) => {
          // Finding all the "item" tags in the xml response which will contain the episode info
          const items = data.querySelectorAll("item");
          // Looping through each item and getting the episode info and pushing it to the 'episodes' array
          items.forEach((item) => {
            let url;

            // Not every podcast episode is going to have the `enclosure` tag, so we need to check if it exists
            try {
              url = item.querySelector("enclosure").getAttribute("url");
            } catch (e) {
              console.log("error", e);
              url = item.querySelector("link").innerHTML;
            }

            episodes.value.push({
              // this `title` and the `guid` properties looks a little different because the title contains CDATA tags which need to be grabbed with the 'childNodes' property
              title: item.querySelector("title").childNodes[0].textContent,
              link: url,
              url: url,
              description: item.querySelector("description").innerHTML,
              pubDate: item.querySelector("pubDate").innerHTML,
              guid: item.querySelector("guid").childNodes[0].textContent,
            });
          });
        })
        .catch((err) => {
          alert("Couldn't get episodes", err);
        });
    }

    // Function to get a transcription from Deepgram, passing in the episode url
    async function getTranscription(episode) {
      // setting the loading state to true for the episode
      episodeTranscriptionLoading.value.push(episode.guid);
      const transcription = await deepgram(episode.url);
      // setting a unique id for the episode transcription
      transcriptions.value[`${podcast.value.id}---${episode.guid}`] =
        transcription;
      // removing the loading state for the episode
      episodeTranscriptionLoading.value.splice(
        episodeTranscriptionLoading.value.indexOf(episode.guid),
        1
      );
    }

    function saveTranscription(podcastId, episodeGuid) {
      console.log(
        "saving transcription",
        transcriptions.value[`${podcastId}---${episodeGuid}`]
      );
      supabase
        .from("transcriptions")
        .insert({
          id: `${podcastId}---${episodeGuid}`,
          podcast_id: podcastId,
          episode_guid: episodeGuid,
          transcript:
            transcriptions.value[`${podcastId}---${episodeGuid}`].channels[0]
              .alternatives[0].transcript,
          user_id: store.state.user.id,
        })
        .then(({ data: [transcriptObject] }) => {
          console.log("saved", transcriptObject);
          savedTranscriptions.value[transcriptObject.id] =
            transcriptObject.transcript;
        });
    }

    async function getTranscriptions() {
      const { data: transcriptions } = await supabase
        .from("transcriptions")
        .select()
        .eq("podcast_id", podcast.value.id);
      console.log("Transcriptions", transcriptions);
      transcriptions.forEach((transcript) => {
        console.log("id", transcript.id);
        savedTranscriptions.value[transcript.id] = transcript.transcript;
      });
    }

    onMounted(() => {
      // Getting podcast info from the database once the component is mounted
      getPodcastData();
    });

    return {
      podcast,
      episodes,
      transcriptions,
      savedTranscriptions,
      episodeTranscriptionLoading,

      getTranscription,
      saveTranscription,
    };
  },
};
</script>

<style scoped></style>
