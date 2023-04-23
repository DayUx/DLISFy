const API_URL = "http://127.0.0.1:8000/";
export const API = {
  login: API_URL + "auth/login",
  register: API_URL + "auth/register",
  admin: API_URL + "admin",
  searchArtistes: API_URL + "music/artist/search",
  createArtiste: API_URL + "admin/artist",
  updateArtiste: API_URL + "admin/artist",
  searchMusiques: API_URL + "music/song/search",
  createMusique: API_URL + "admin/song",
  updateMusique: API_URL + "admin/song",
  searchStyles: API_URL + "music/style/search",
  createStyle: API_URL + "admin/style",
  updateStyle: API_URL + "admin/style",
  getMusiqueById: API_URL + "music/song/id",
  getArtisteById: API_URL + "music/artist/id",
};
