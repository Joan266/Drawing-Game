import http from "../http-common";

class PintureteDataService {
    createTable(data) {
        return http.post("/createtable", data);
    }
    checkTable(data) {
        return http.post("/checktable", data);
    }
    createPlayer(data) {
        return http.post("/createplayer", data);
    }
    checkPlayers(data) {
        return http.post("/checkplayers", data);
    }
    deletePlayer(data) {
        return http.post("/deleteplayer", data);
    }
    gameInfo(data) {
        return http.post("/gameinfo", data);
    }
}
const pintureteDB = new PintureteDataService();
export default pintureteDB;