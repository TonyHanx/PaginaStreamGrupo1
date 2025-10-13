export function isLoggedIn(): boolean {
  return localStorage.getItem("auth") === "true";
}
export function loginFake() {
  localStorage.setItem("auth", "true");
}
export function logoutFake() {
  localStorage.removeItem("auth");
}

