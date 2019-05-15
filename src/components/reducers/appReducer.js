const appReducer = (state, action) => {
  switch (action.type) {
    case "setAuthUser":
      return {
        ...state,
        authUser: action.authUser
      };
    case "setStoreSettings":
      return {
        ...state,
        storeSettings: action.storeSettings
      };
    case "setCategorySettings":
      return {
        ...state,
        categorySettings: action.categorySettings
      };
    case "setTitle":
      return {
        ...state,
        headerTitle: action.newTitle
      };

    default:
      return state;
  }
};

export default appReducer;
