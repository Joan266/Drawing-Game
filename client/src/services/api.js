import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-type": "application/json"
    }
});

export default class AxiosRoutes {
    static async createRoom(data) {
        try {
            const response = await http.post("/createroom", data);
            return response.data;
        } catch (error) {
            console.error("Error creating room:", error);
            throw error;
        }
    }

    static async joinGame(data) {
        try {
            const response = await http.post("/joinroom", data);
            return response.data;
        } catch (error) {
            console.error("Error joining room:", error);
            throw error;
        }
    }

    static async addWord(data) {
        try {
            const response = await http.post("/addword", data);
            return response.data;
        } catch (error) {
            console.error("Error adding word:", error);
            throw error;
        }
    }

    static async randomWords(data) {
        try {
            const response = await http.post("/randomwords", data);
            return response.data;
        } catch (error) {
            console.error("Error generating random words:", error);
            throw error;
        }
    }
}
