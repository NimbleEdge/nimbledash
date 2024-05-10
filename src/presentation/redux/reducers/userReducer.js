export var userReducer = {
    setUser(state, payload) {
        state.authMethod = payload.payload.authMethod;
        state.username = payload.payload.username;
        state.password = payload.payload.password;
        state.email = payload.payload.email;
        state.accessToken = payload.payload.accessToken;
        state.clientId = payload.payload.clientId;
        state.clientIdList = payload.payload.clientIdList;
    },
  };
  