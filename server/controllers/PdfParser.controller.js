import PdfParse from "pdf-parse";
import convertPdfToJson from "../utils/PdfToJsonConverter";

export async function parseBankStatement(req, res) {
  try {
    const filePath = req.file.path;
    const data = await PdfParse(filePath);
    const json = convertPdfToJson(data.text);
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
