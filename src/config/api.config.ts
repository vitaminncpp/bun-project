const ApiConfig: { [key: string]: string } = {
  ROOT: "/",
  API: "/api",
  SYS_INFO: "/sys-info",
  AUTH: "/auth",
  REGISTER: "/register",
  LOGIN: "/login",
  REFRESH: "/refresh",

  USER: "/user",
  USERS: "/users",
  USERNAME: "/users/:id",

  ROLE: "/role",
  ROLENAME: "/role/rolename",

  GAME: "/game",
  MATCH: "/game/match",
  MATCH_ID: "/game/match/:connectionId",
  MATCH_GUEST: "/game/match/guest",
  MATCH_GUEST_ID: "/game/match/guest/:connectionId",

  FILE: "/file",
  PROJECTS: "/projects",
  PROJECT_ID: "/projects/:id",

  SHELL: "/shell",

  TEST: "/test",
};

export default ApiConfig;
