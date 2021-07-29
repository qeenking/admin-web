const apiUrl = "https://api.dangnagwi.lomy.info";

const authProvider = {
  login: async ({ username, password }) => {
    const email = username;
    //로그인 창에서 username과 password를 받아와서 Request(주소, Option)로 선언함
    const request = new Request(`${apiUrl}/auths/signin`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    //fetch를 이용하여 위에서 지정한 request를 전송
    try {
      const response = await fetch(request);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }
      const auth = await response.json(); //받아온 token을 auth로 지정
      localStorage.setItem("auth", JSON.stringify(auth.token)); //localStorage에 auth라는 이름으로 token 저장
    } catch (e) {
      throw new Error("Network error");
    }
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject({ redirectTo: "/login" });
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem("auth") ? Promise.resolve() : Promise.reject();
  },
  logout: () => {
    localStorage.removeItem("auth"); //로그아웃하면 로컬에서 auth 값을 제거
    return Promise.resolve();
  },
  getPermissions: () => {
    return Promise.resolve();
  },
};

export default authProvider;
