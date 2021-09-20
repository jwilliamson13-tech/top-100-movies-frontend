import http from "../http-common";

class AuthService{
  getAuth(){
    return http.get('/', {mode: 'no-cors'});
    //return http.get('/users/profile',{mode: 'no-cors'});
  }
}

export default new AuthService();
