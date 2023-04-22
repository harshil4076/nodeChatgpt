import { OpenAI } from "langchain/llms/openai";
import {RetrievalQAChain} from 'langchain/chains'
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import * as dotenv from 'dotenv'

dotenv.config()

const txtFilename = "knowledge_graph";
const question = "combine text embeddings and knowledge graph? Answer in detail";
const txtPath=`./${txtFilename}.txt`;
const VECTOR_STORE_PATH = `${txtFilename}.index`

export const runWithEmbeddings = async () => {

  const model = new OpenAI({})

  let vectorStore;
  if(fs.existsSync(VECTOR_STORE_PATH)){
    console.log('Vector Exist..')
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings())
  }else {
    const text = fs.readFileSync(txtPath, 'utf-8');

    const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000});

    const docs = await textSplitter.createDocuments([text]);

    vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    await vectorStore.save(VECTOR_STORE_PATH)
  }
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    const res = await chain.call({
      query: question,
    })

    console.log({res})

}

runWithEmbeddings();