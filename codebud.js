require('dotenv').config()
// https://platform.openai.com/docs/api-reference/completions?lang=node.js
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
    //generate KEY from openAI account

  });
const openai = new OpenAIApi(configuration);

//This is based on code-davinci from openai.
//If you pass in some code it gives suggestions, fixes or optimizations
//Ex. Run node codebud.js "convert to arrow function function codebud(code){{}" 
async function chatText (input){
    try {
        const response = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: input,
            temperature: 0,
            max_tokens: 500,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ["You:"],
          });
        console.log(response.data.choices[0].text);
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