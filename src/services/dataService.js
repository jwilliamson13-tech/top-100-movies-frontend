import http from "../http-common";

class MoviesDataService{
  getAll(page=0){
    return http.get(`?page=${page}`);
  }

  getMovies(name){
    return http.get(`/movies?name=${name}`);
  }

  addMovie(id,movie,rank){
    
  }
}

export default new MoviesDataService();
