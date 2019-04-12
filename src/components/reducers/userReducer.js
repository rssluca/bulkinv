const userReducer = (state, action) => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        user: action.user
      };

    default:
      return state;
  }
};

export default userReducer;
