require("dotenv").config();
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

const tweetTemplate = "Generate A Marketable, GenZ, Promotional Tweet for a product, from this product description:{productDesc}";
const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

//setting up chains - returns-> Runnable Sequence
const tweetChain = tweetPrompt.pipe(llm); //prompt chained to llm , passing prompt to llm/connecting the two 

const run = async() => {
    const response = await tweetChain.invoke({ productDesc:'An AI ChatBot made using Langchain' })
    console.log(response.content);
} 
run();

