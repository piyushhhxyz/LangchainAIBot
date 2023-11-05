require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { SupabaseVectorStore } = require("langchain/vectorstores/supabase");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai")


const url = process.env.SUPABASE_URL_AGI_CHATBOT;
const privateKey = process.env.SUPABASE_API_KEY;
const openAIApiKey = process.env.OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const client = createClient(url, privateKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents", //default
    queryName: "match_documents" //default
})

const retriever = vectorStore.asRetriever()

module.exports = retriever;

