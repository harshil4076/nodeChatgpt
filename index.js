require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
    //generate KEY from openAI account

  });
const openai = new OpenAIApi(configuration);
async function chatText (input){
    try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: input,
          max_tokens: 500,
          temperature: 0,
        });
        console.log(completion.data.choices[0].text);
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
}
const input = process.argv[2]

chatText(input)

// example command node index.js "How to create chatgpt?"