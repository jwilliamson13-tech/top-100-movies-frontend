import axis from "axios";

export default axis.create({
  baseURL: "https://jwilliamson-top-100-movies-api.herokuapp.com/api/v1",
  headers:{
    "Content-type":"application/json"
  }
});
