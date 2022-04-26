<template>
  <div>
    <button @click="toggleListen()">💬</button>
    <p>{{ deepgramStatus }}</p>
    <p>The commands are:</p>
    <div>"ADD TO DO..."</div>
    <div>"DELETE..."</div>
    <div>"CHECK OFF..."</div>
  </div>
  <br />
</template>

<script>
import { ref, watch } from "vue";
import useDeepgramSocket from "@/composables/useDeepgramSocket";
import { useTodoListStore } from "../store/useTodoListStore";

export default {
  setup() {
    const { DG_socket, DG_transcript, openStream, closeStream } =
      useDeepgramSocket();
    const store = useTodoListStore();

    let deepgramStatus = ref("Deepgram Not Connected");
    let isListening = ref(false);
    let utterance = ref(DG_transcript);
    let count = ref(store.todoList.length);

    function toggleListen() {
      if (!isListening.value) {
        openStream();
        isListening.value = true;
      } else {
        closeStream();
        isListening.value = false;
      }
    }

    function standardizeUtterance(command) {
      const punctuation = /[.,?"]+/g;
      const change = command.toLowerCase().replace(punctuation, "").trim();
      return change;
    }

    function removeCommandPhrase(command, reg) {
      const change = command.replace(reg, "").trim("");
      return change;
    }

    function alertMisunderstood() {
      // if count doesn't equal todo list length, the command was misunderstood
      if (count.value !== store.todoList.length) {
        deepgramStatus.value = "I didn't catch that";
        setTimeout(() => {
          deepgramStatus.value = "Listening";
        }, 1000);
      }
    }

    function addTodo(command) {
      const addRegEx = [
        /^add to do/,
        /^and to do/,
        /^had to do/,
        /^ad to do/,
        /^had to dew/,
        /^add to dew/,
        /^ad to dew/,
        /^and to dew/,
      ];

      // clean up utterance
      const item = standardizeUtterance(command);
      addRegEx.find((reg) => {
        if (reg.test(item)) {
          // remove command phrase ADD TO DO
          const todo = removeCommandPhrase(item, reg);
          // add to store
          store.addTodo(todo);
          // reset count
          count.value = store.todoList.length;
        }
      });
    }

    function deleteTodo(command) {
      const deleteRegEx = [/^delete/];
      // clean up utterance
      const item = standardizeUtterance(command);
      deleteRegEx.find((reg) => {
        if (reg.test(item)) {
          // remove command phrase DELETE TO DO
          const todo = removeCommandPhrase(item, reg);
          store.todoList.forEach((storeTodo) => {
            // if item in store todo list matches this utterance,
            if (storeTodo.item === todo) {
              // delete from store
              store.deleteTodo(storeTodo.id);
              // reset count
              count.value = store.todoList.length;
            }
          });
        }
      });
    }

    function checkOffTodo(command) {
      const checkOffRegEx = [/^check off/];
      const item = standardizeUtterance(command);

      checkOffRegEx.find((reg) => {
        if (reg.test(item)) {
          const todo = removeCommandPhrase(item, reg);

          store.todoList.forEach((storeTodo) => {
            if (storeTodo.item === todo) {
              // toggle completed in store:
              store.toggleCompleted(storeTodo.id);
              count.value = store.todoList.length;
            }
          });
        }
      });
    }

    watch(DG_socket, () => {
      if (DG_socket.value === "Connecting") {
        deepgramStatus.value = "Connecting";
      } else if (DG_socket.value === "Not Connected") {
        deepgramStatus.value = "Voice Controls Off";
      } else if (DG_socket.value === "Closing connection...") {
        deepgramStatus.value = "Closing connection...";
      } else {
        deepgramStatus.value = "Listening";
      }
    });

    watch(utterance, () => {
      if (utterance.value !== "") {
        count.value++;
        addTodo(utterance.value);
        deleteTodo(utterance.value);
        checkOffTodo(utterance.value);
        alertMisunderstood();
      }
    });

    return { deepgramStatus, toggleListen, utterance, count, store };
  },
};
</script>
