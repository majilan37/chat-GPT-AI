import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const prompt = req.body.prompt || "";

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).json({
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    console.log(res);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server listening on port 5000.");
});
