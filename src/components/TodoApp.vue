<template>
  <h1>To-Do List</h1>
  <todo-speech />
  <todo-form />
  <todo-list />
</template>

<script>
import TodoForm from "./TodoForm.vue";
import TodoList from "./TodoList.vue";
import TodoSpeech from "./TodoSpeech.vue";
export default {
  components: {
    TodoForm,
    TodoList,
    TodoSpeech,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
