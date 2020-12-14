import { writable, get } from "svelte/store";

export const user = writable({
  username: "",
  email: "",
  password: "",
  token: null,
});

export const getUser = () => get(user);

export const userdata = localStorage.getItem("userdata")
  ? JSON.parse(localStorage.getItem("userdata"))
  : null;
