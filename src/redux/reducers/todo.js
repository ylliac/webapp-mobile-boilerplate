import {ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED} from '../../../actions'

export const initialState = [];
export const defaultAction = { type: 'UNKOWN_ACTION' }

export default (state = initState, action = defaultAction) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text
        },
        ...state
      ];

    case DELETE_TODO:
      return state.filter(todo =>
        todo.id !== action.id
      );

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          Object.assign({}, todo, {text: action.text}) :
          todo
      );

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          Object.assign({}, todo, {completed: !todo.completed}) :
          todo
      );

    case COMPLETE_ALL: {
      const areAllMarked = state.every(todo => todo.completed);
      return state.map(todo => Object.assign({}, todo, {
        completed: !areAllMarked
      }));
    }

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false);

    default:
      return state;
  }
}












​
export default (state = initState, action = defaultAction) => {
  switch (action.type) {
    case SET_LAYOUTS: return [...action.layouts]
    case ADD_LAYOUT: return [...state, action.layout]
    default: return state
  }
}