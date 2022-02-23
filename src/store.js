import { reactive } from "vue";
import { supabase } from "./supabase";

export const store = {
  state: reactive({
    user: {},
    podcasts: [],
  }),

  addPodcastToStore(podcast) {
    this.state.podcasts.push(podcast);
  },
  getPodcastsFromDB() {
    supabase
      .from("podcasts")
      .select("*")
      .then(({ body }) => {
        this.state.podcasts = body;
      });
  },
};
