import { ref } from "vue";
import useDeepgramKey from "./useDeepgramKey";
import useMicrophone from "./useMicrophone";

let DG_socket = ref("");
let DG_transcript = ref("");
let apiKey;
let microphone;
let socket;

function openDeepgramSocket(apiKey, microphone) {
  socket = new WebSocket("wss://api.deepgram.com/v1/listen?punctuate=true", [
    "token",
    apiKey,
  ]);

  socket.onopen = () => {
    if (microphone.state != "recording") {
      DG_socket.value = "Connected to Deepgram";
      console.log("Connection opened.");

      microphone.addEventListener("dataavailable", async (event) => {
        if (event.data.size > 0 && socket.readyState == 1) {
          socket.send(event.data);
        }
      });

      microphone.start(200);
    }
  };

  socket.onmessage = (message) => {
    const received = JSON.parse(message.data);
    const transcript = received.channel.alternatives[0].transcript;
    if (transcript && received.is_final) {
      DG_transcript.value = transcript + "";
    }
  };

  socket.onclose = () => {
    DG_socket.value = "Not Connected";
    console.log("Connection closed.");
  };
}

//Methods to make available in component

const openStream = () => {
  if (DG_socket.value != "Connected") {
    DG_socket.value = "Connecting";
    useDeepgramKey().then((keyRes) => {
      useMicrophone().then((microphoneRes) => {
        apiKey = keyRes.key.value;
        microphone = microphoneRes.microphone;
        openDeepgramSocket(apiKey, microphone);
      });
    });
  }
};

const closeStream = () => {
  microphone.stop();
  socket.close();
  DG_socket.value = "Closing connection...";
};

export default function useDeepgramSocket() {
  return { DG_socket, DG_transcript, openStream, closeStream };
}
