​export const ADD_TODO = 'ADD_TODO';
export function addTodo(text) {
  return {type: ADD_TODO, text};
}
​
export const DELETE_TODO = 'DELETE_TODO';
export function deleteTodo(id) {
  return {type: types.DELETE_TODO, id};
}

export const EDIT_TODO = 'EDIT_TODO';
export function editTodo(id, text) {
  return {type: types.EDIT_TODO, id, text};
}

export const COMPLETE_TODO = 'COMPLETE_TODO';
export function completeTodo(id) {
  return {type: types.COMPLETE_TODO, id};
}

export const COMPLETE_ALL = 'COMPLETE_ALL';
export function completeAll() {
  return {type: types.COMPLETE_ALL};
}

export const CLEAR_COMPLETED = 'CLEAR_COMPLETED';
export function clearCompleted() {
  return {type: types.CLEAR_COMPLETED};
}

