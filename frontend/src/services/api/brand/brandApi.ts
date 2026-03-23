import api from "../api";

export const getBrands = async () => api.get("/brands");
