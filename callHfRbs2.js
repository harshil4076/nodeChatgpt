import dotenv from 'dotenv'
import {HfInference} from "@huggingface/inference"

dotenv.config()
async function callHG(){
const hf = new HfInference(process.env.HUGGING_FACE_KEY)

await hf.summarization({
    model: 'facebook/bart-large-cnn',
    inputs:
      'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930.',
    parameters: {
      max_length: 100
    }
  }).then((res) => {
    console.log(res)
    }).catch((err) => {
    console.log(err)
    })
}
callHG()
