import { writable } from 'svelte/store'
import supabase from "$lib/supabase/client";

export const todos = writable([])
export const isTodoReady = writable(false)
export const isAddTodoDone = writable(false)

export const getTodos = async () => {
  isTodoReady.set(true)
  let { data } = await supabase.from("todos").select("*");
  todos.set(data);
  isTodoReady.set(false)

  let todosTemp
  todos.subscribe(val => {
    todosTemp = val
    console.log('todos | store', todosTemp)
  })
}

export const addTodo = async (todo) => {  
  // add todo to database
  const { data, error } = await supabase
  .from('todos')
  .insert([
    { todo },
  ])

  // update local todos
  todos.update((cur) => [...cur, {todo}])
  isAddTodoDone.set(true)
}

export const deleteTodo = async (id) => {  
  // delete todo from database
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  // update local todos
  todos.update(todos => todos.filter(todo => todo.id !== id))
}

export const toggleTodo = async (done, id) => {   
  // update todo from database
  const { data, error } = await supabase
    .from('todos')
    .update({ done: !done })
    .eq('id', id)

  // update local todos
  todos.update(todos => todos.map(todo => todo.id === id ? { ...todo, done: !done } : todo))
}