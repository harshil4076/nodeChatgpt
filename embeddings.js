//write code to generate embeddings from openai embeddings api
import dotenv from "dotenv"
// https://platform.openai.com/docs/api-reference/completions?lang=node.js
import { Configuration, OpenAIApi } from "openai"
import pDFParser from 'pdf-parse'
import fs from 'fs'
import {createObjectCsvWriter}from 'csv-writer'
import csv from 'csv-parser'
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
    //generate KEY from openAI account

  });
const openai = new OpenAIApi(configuration);
async function generateEmbeddings(prompt) {
    try{
        const embb = await openai.createEmbedding({
            input: prompt,
            model: "text-embedding-ada-002"
        });
        console.log(embb.data.data[0].embedding);
        return embb.data.data[0].embedding
    }catch(err){
        console.log(err);
    }
}
//read data from a pdf file
// async function readData(){
//     const buffer = fs.readFileSync('harshil_dev_resume.pdf');
//     //convert pdf to text
//     try{
//         const pdf = await pDFParser(buffer);
//         // write a function to divide the text into chunks of 1000 words

//         console.log(pdf.text.length);
//     }
//     catch(err){
//         console.log(err);
//     }

// }
readData()

async function readData() {
    const buffer = fs.readFileSync('knowledge_Graph.pdf');

    try {
        const pdf = await pDFParser(buffer);

        // Divide the text into chunks of 1000 words
        const chunks = splitIntoChunks(pdf.text, 1000);

        // Save the extracted text to a .txt file
        fs.writeFile('output.txt', pdf.text, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Text saved to output.txt');
            }
        });

        console.log(pdf.text.length);
    } catch (err) {
        console.log(err);
    }
}

// Function to divide the text into chunks of n words
function splitIntoChunks(text, n) {
    const words = text.split(/\s+/);
    const chunks = [];

    for (let i = 0; i < words.length; i += n) {
        chunks.push(words.slice(i, i + n).join(' '));
    }

    return chunks;
}
async function dividePdfTextIntoChunks(filePath, chunkSize = 1000) {
    // Read the PDF file as a binary buffer
    const buffer = fs.readFileSync(filePath);

    // Parse the PDF file and extract the text
    const pdf = await pDFParser(buffer);
    const text = pdf.text;

    // Split the text into chunks of the specified size
    const words = text.split(' ');
    const chunks = [];
    let chunk = '';

    for (const word of words) {
      if (chunk.split(' ').length < chunkSize) {
        chunk += word +  ' ';
      } else {
        chunks.push(chunk.trim());
        chunk = word + ' ';
      }
    }

    // Add the last chunk, if any
    if (chunk) {
      chunks.push(chunk.trim());
    }

    // Return the chunks
    return chunks;
  }
// console.log(readData())
// generateEmbeddings("This is a test");
async function main() {
    const chunks = await dividePdfTextIntoChunks('comp_policy.pdf', 1000);
    // console.log(chunks[1].length);
    //write for loop to loop through chunks and generate embeddings
    //save the result in a csv file
    const csvWriter = createObjectCsvWriter({
        path: 'embeddings.csv',
        header: [
            { id: 'embedding', title: 'Embedding' },
          ]

    })
    for (const chunk of chunks) {
        const embdResponse = await generateEmbeddings(chunk);
        const record = [{ embedding: embdResponse.join(',')}]
       csvWriter.writeRecords(record).then(()=> console.log('The CSV file was written successfully'));
    }
  }

// main()

async function textReply(){

async function queryEmbedding(word, filename) {
  return new Promise((resolve, reject) => {
    const embeddings = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (row) => {
        embeddings.push({
          token: row.Token,
          embedding: row.Embedding.split(',').map(parseFloat)
        });
      })
      .on('end', () => {
        const queryEmbedding = embeddings.find((embedding) => embedding.token === word);
        if (queryEmbedding) {
          resolve(queryEmbedding.embedding);
        } else {
          reject(new Error(`Embedding not found for word "${word}"`));
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Example usage:
queryEmbedding('governance', 'embeddings.csv')
  .then((embedding) => console.log(embedding))
  .catch((err) => console.error(err));

}
// textReply()
// console.log(main())
// console.log(readData())
// console.log(dividePdfTextIntoChunks('comp_policy.pdf'))
// console.log(generateEmbeddings("This is a test"))
// console.log(main())
// console.log(readData())
// console.log(dividePdfTextIntoChunks('comp_policy.pdf'))
// console.log(generateEmbeddings("This is a test"))
// console.log(main())
// console.log(readData())
// console.log(dividePdfTextIntoChunks('comp_policy.pdf'))
// console.log(generateEmbeddings("This is a test"))
// console.log(main())
// console.log(readData())
// console.log(dividePdfTextIntoChunks('comp_policy.pdf'))
// console.log(generateEmbeddings("This is a test"))
// console.log(main())
// console.log(readData())
// console.log(dividePdfTextIntoChunks('comp_policy.pdf'))
// console.log(generateEmbeddings("This is a test"))