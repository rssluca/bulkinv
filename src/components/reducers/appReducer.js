const appReducer = (state, action) => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        headerTitle: action.newTitle
      };

    default:
      return state;
  }
};

export default appReducer;
