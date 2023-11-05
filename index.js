const fs = require("fs");
require("dotenv").config();
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

const { createClient } = require("@supabase/supabase-js");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { SupabaseVectorStore } = require("langchain/vectorstores/supabase");

const { generateStandAloneQs } = require("./standAloneQs");
const { ChatOpenAI } = require("langchain/chat_models/openai");


const privateKey = process.env.SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL_AGI_CHATBOT;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const openAIApiKey = process.env.OPENAI_API_KEY;
if(!openAIApiKey) throw new Error(`Expected env var OPENAI_API_KEY`)

const llm = ChatOpenAI({ openAIApiKey })
const embeddings = new OpenAIEmbeddings({ openAIApiKey })


const run = async() => {
    const InformationSource = fs.readFileSync('scrimba-info.txt', 'utf-8')        
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        separators:['/n/n','/n',' ',''], //Defaults
        chunkOverlap:50, //  10%
    })
    //Chunks Of Texts Created.
    const chunks = await splitter.createDocuments([InformationSource]) 

    //setup SupaBase VectorStore
    const client = createClient(url, privateKey);

    //Creating Embeddings & Uploading to Supabase
    const vectorStore = await SupabaseVectorStore.fromDocuments(
        chunks,
        embeddings,
        { client, tableName: "documents" }
    );
    
    const VectorStore = new SupabaseVectorStore(embeddings, {
        client,
        tableName: "documents", //default
        queryName: "match_documents" //default
    })
}
run();