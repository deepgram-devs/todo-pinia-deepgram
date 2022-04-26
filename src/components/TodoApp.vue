<template>
  <h1>To-Do List</h1>
  <todo-form />
  <todo-list />
</template>

<script>
import TodoForm from "./TodoForm.vue";
import TodoList from "./TodoList.vue";
export default {
  components: {
    TodoForm,
    TodoList,
  },
  setup() {
    return {};
  },
};
</script>
