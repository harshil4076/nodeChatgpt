//1. Import necessary packages
import { GithubRepoLoader } from 'langchain/document_loaders/web/github'
import { OpenAI } from "langchain/llms/openai";
import {RetrievalQAChain} from 'langchain/chains'
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import fs from 'fs'
import * as dotenv from 'dotenv'
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

dotenv.config()

const runCndiChatBot = async () => {
    // Initialize openai model

    //Use Github to query cndi
    const cndi_loader = new GithubRepoLoader(
            "https://github.com/polyseam/cndi/blob/main/README.md",
            {branch: "main", recursive:false, unknown: "warn", accessToken:process.env.GITHUB_ACCESS_TOKEN}
    )
    //convert it to text if needed
    const docs = await cndi_loader.loadAndSplit();
    console.log(docs)
    //Create an eample prompt
    const template = `
    Given a prompt, extrapolate as many relationships as possible from it and provide a list of updates.
    Example: prompt: Alice is Bob's roommate.
    updates:[["Alice", "roommate", "Bob" ]]

    prompt: Boris Johnson was the prime minister of UK. Moris is a citizen of United Kingdom.
    updates:
    [["Boris Johnson", "prime mininster", "UK"]]
    [["Boris Johnson", "citizen", "United Kingdom"]]

    Provide a list of updates for text. {cndi_data}
    `

    // use openai to extract entity and relationships based on the extract_entity_promt from docs

    const prompt = new PromptTemplate({template, inputVariables: ["cndi_data"]})

    const model = new OpenAI({modelName: "gpt-3.5-turbo"})

    const chain = new LLMChain({llm: model,  prompt})
    const res = await chain.call({cndi_data: docs})
    console.log(res)
    // fs.writeFileSync("cndi_cypher", res.text)
}

runCndiChatBot()