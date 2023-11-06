import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api/mongoDB",
    headers: {
        "Content-type": "application/json"
    }
});

export default class AxiosRoutes {
    static creategame(data) {
        return http.post("/creategame", data);
    }
    static joingame(data) {
        return http.post("/joingame", data);
    }
    static roomInfo(data) {
        return http.post("/roominfo", data);
    }
    static saveWord(data) {
        return http.post("/saveword", data);
    }
}
