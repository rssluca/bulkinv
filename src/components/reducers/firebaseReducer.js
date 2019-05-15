const firebaseReducer = (state, action) => {
  switch (action.type) {
    case "setFirebase":
      return action.firebase;

    default:
      return state;
  }
};

export default firebaseReducer;
