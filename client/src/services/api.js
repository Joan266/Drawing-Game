import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api/mongoDB",
    headers: {
        "Content-type": "application/json"
    }
});

export default class AxiosRoutes {
    static async createGame(data) {
        try {
            const response = await http.post("/creategame", data);
            return response.data;
        } catch (error) {
            console.error("Error creating game:", error);
            throw error;
        }
    }

    static async joinGame(data) {
        try {
            const response = await http.post("/joingame", data);
            return response.data;
        } catch (error) {
            console.error("Error joining game:", error);
            throw error;
        }
    }

    static async roomInfo(data) {
        try {
            const response = await http.post("/roominfo", data);
            return response.data;
        } catch (error) {
            console.error("Error fetching room info:", error);
            throw error;
        }
    }

    static async saveWord(data) {
        try {
            const response = await http.post("/saveword", data);
            return response.data;
        } catch (error) {
            console.error("Error saving word:", error);
            throw error;
        }
    }
}
