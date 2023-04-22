//1. Import necessary packages
import { GithubRepoLoader } from 'langchain/document_loaders/web/github'
import { OpenAI } from "langchain/llms/openai";
import {RetrievalQAChain} from 'langchain/chains'
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()
const question = "how to create AWS cluster using CNDI and deploy a neo4j database?";

const VECTOR_STORE_PATH = "cndi_store.index"

const runCndiChatBot = async () => {
    const model = new OpenAI({modelName: "gpt-3.5-turbo"})

    let vectorStore;
    if(fs.existsSync(VECTOR_STORE_PATH)){

      console.log('Vector Exist..')
      vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings())

    }else {

        const cndi_loader = new GithubRepoLoader(
            "https://github.com/polyseam/cndi",
            {branch: "main", recursive:true, unknown: "warn", }
        )
        //convert it to text if needed
        const docs = await cndi_loader.loadAndSplit();

        vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

         await vectorStore.save(VECTOR_STORE_PATH)

    }
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    const res = await chain.call({
      query: question,
    })

    console.log({res})
}

runCndiChatBot()