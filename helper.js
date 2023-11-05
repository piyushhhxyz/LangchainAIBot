require("dotenv").config();
const { ChatOpenAI } = require("langchain/chat_models/openai");

const { PromptTemplate } = require("langchain/prompts");
const { StringOutputParser } = require('langchain/schema/output_parser');
const retriever = require("./retriever");
const { combineDocuments } = require("./utils/combineDocs");


const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });


const questionTemplate = "Given a question, convert it to a standalone question. question: {question} standalone question:"
const promptTemplate = PromptTemplate.fromTemplate(questionTemplate);


const chain = promptTemplate.pipe(llm)
                            .pipe(new StringOutputParser()).pipe(retriever).pipe(combineDocuments);

async function generateStandAloneQs(){
    const standAloneQs = await chain.invoke({ question: "What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful." });
    console.log(standAloneQs);
}
generateStandAloneQs();

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.`