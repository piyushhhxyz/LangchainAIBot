require("dotenv").config();
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const { StringOutputParser } = require("langchain/schema/output_parser");
const retriever = require("./retriever");

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });


const question = "I Am thinking of Buying one of your Tshirt but i need to know what are your return policies is as some tshirts dont fit me and I dont wanna waste money"

const quesTemplate = "Convert this question:{question} to a StandAlone question, reduce as much as possible, to its minimum smallest possible form"
const prompt = PromptTemplate.fromTemplate(quesTemplate);

const chain = prompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever);

async function generateStandAloneQs(){
    const StandAloneQs = await chain.invoke({ question }) ; // StandALone Question Generated
    console.log(StandAloneQs);
}
generateStandAloneQs();
// module.exports = { generateStandAloneQs };


