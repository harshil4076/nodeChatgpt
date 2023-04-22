import * as dotenv from 'dotenv'
// https://platform.openai.com/docs/api-reference/completions?lang=node.js
import { Configuration, OpenAIApi } from "openai"
dotenv.config()
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    //generate KEY from openAI account

  });
const openai = new OpenAIApi(configuration);
const examples = `
Given a prompt, extrapolate as many relationships as possible from it and provide a list of updates.
Generate cypher from updates as well.
Example: prompt: Alice is Bob's roommate.
updates:[["Alice", "roommate", "Bob" ]]

prompt: Boris Johnson was the prime minister of UK. Moris is a citizen of United Kingdom.
updates:
[["Boris Johnson", "prime mininster", "UK"]]
[["Boris Johnson", "citizen", "United Kingdom"]]
`
async function chatText (input){
    try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: examples + input,
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