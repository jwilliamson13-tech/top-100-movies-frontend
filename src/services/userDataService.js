import http from "../http-users";

class userDataService{
  getUsers(){
    return http.get(`users`,{mode:'no-cors'});
  }

  getUser(userId){
    return http.get(`/users/${userId}`,{mode:'no-cors'});
  }
}

export default new userDataService();
