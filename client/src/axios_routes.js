import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api/mongoDB",
    headers: {
        "Content-type": "application/json"
    }
});

export default class AxiosRoutes {
    static createTable(data) {
        return http.post("/createtable", data);
    }
    static checkTable(data) {
        return http.post("/checktable", data);
    }
    static createPlayer(data) {
        return http.post("/createplayer", data);
    }
    static checkPlayers(data) {
        return http.post("/checkplayers", data);
    }
    static deletePlayer(data) {
        return http.post("/deleteplayer", data);
    }
    static gameInfo(data) {
        return http.post("/gameinfo", data);
    }
    static saveWord(data) {
        return http.post("/saveword", data);
    }
    static chatInfo(data) {
        return http.post("/chatinfo", data);
    }
}
