import axios from "axios";

export async function getStockNews(req, res) {
  try {
    const response = await axios.get(
      "https://seeking-alpha.p.rapidapi.com/articles/v2/list-trending?size=20",
      {
        headers: {
          "x-rapidapi-host": "seeking-alpha.p.rapidapi.com",
          "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
