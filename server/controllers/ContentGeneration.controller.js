import axios from "axios";

export async function generateTextContent(req, res) {
  const { title } = req.body;
  const PROMPT =
    "You are a creative blog writer. write a 1000-word blog post about the title below. You can write anything you want, but it must be at least 50 words long. The title is: ";

  const requestParams = {
    model: "HuggingFaceH4/zephyr-7b-beta",
    messages: [
      { role: "system", content: PROMPT + title },
      { role: "user", content: title },
    ],
    max_new_tokens: 2048,
  };
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/v1/chat/completions",
      requestParams,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        },
      }
    );
    const data = response.data;
    res.json({ generatedContent: data.choices[0].message.content });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
}

export async function generateImageContent(req, res) {
  const { title } = req.body;
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      { inputs: title },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    res.status(200).json({ imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
}
