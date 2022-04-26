<template>
  <div v-for="todo in todoList" :key="todo.id" class="todo-list">
    <div class="todo">
      <span :class="{ completed: todo.completed }">{{ todo.item }}</span>
      <div>
        <span @click.stop="toggleCompleted(todo.id)">&#10004;</span>
        <span @click="deleteTodo(todo.id)" class="x">&#10060;</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useTodoListStore } from "../store/useTodoListStore";
import { storeToRefs } from "pinia";
export default {
  setup() {
    const store = useTodoListStore();

    const { todoList } = storeToRefs(store);
    const { toggleCompleted, deleteTodo } = store;

    return { todoList, toggleCompleted, deleteTodo };
  },
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}

.todo-list {
  display: flex;
  justify-content: center;
}
.todo {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  width: 20vw;
}

span {
  padding: 0 10px;
}
</style>
