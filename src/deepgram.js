const deepgramKey = import.meta.env.VITE_DEEPGRAM_KEY;

async function deepgram(url) {
  const response = await fetch(
    "https://api.deepgram.com/v1/listen?punctuate=true&diarize=true&utterances=true",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${deepgramKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    }
  );
  const json = await response.json();
  console.log(json);
  return json.results;
}

export default deepgram;
