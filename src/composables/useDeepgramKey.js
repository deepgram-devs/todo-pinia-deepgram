import { ref } from "vue";
let key = ref("");
let DGStatus = ref("Deepgram Not Connected");

async function getKey() {
  try {
    const res = await fetch("http://localhost:8080/deepgram-token", {
      headers: { "Content-type": "application/json" },
    });
    if (res) {
      const response = await res.json();
      // update with temporary api key:
      key.value = response.key;
      return key;
    }
  } catch (error) {
    if (error) {
      // update to show error message on screen
      DGStatus.value = "Error. Please try again.";
    }
  }
}

export default async function useDeepgramKey() {
  await getKey();
  return { key, DGStatus };
}
