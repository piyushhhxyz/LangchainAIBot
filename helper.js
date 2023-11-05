require("dotenv").config();
const { ChatOpenAI } = require("langchain/chat_models/openai");

const { PromptTemplate } = require("langchain/prompts");
const { StringOutputParser } = require('langchain/schema/output_parser');
const retriever = require("./utils/retriever");
const { combineDocuments } = require("./utils/combineDocs");
const { RunnableSequence, RunnablePassthrough } = require("langchain/schema/runnable");


const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

const question = `What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.`;
const questionTemplate = `Given a question, convert it to a standalone question. 
                question: {question}
                standalone question:`
const questionPrompt = PromptTemplate.fromTemplate(questionTemplate);

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
                nearest_match: {nearest_match}
                original_question: {original_question}
                answer: `
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

//chains
const standAloneChain = RunnableSequence.from([questionPrompt, llm, new StringOutputParser()]);
const retrieverChain = RunnableSequence.from([
    prev => prev.standalone_question,
    retriever,
    combineDocuments, //to Extract texts from Array of Objects weget from retriever.
])
const answerChain = RunnableSequence.from([answerPrompt, llm, new StringOutputParser()]);  

const chain = RunnableSequence.from([
    {
        standalone_question: standAloneChain,
        original_input: new RunnablePassthrough(), //passing down the original_question 
    },
    {
        nearest_match: retrieverChain,
        original_question: ({ original_input }) => original_input.question,
    },
    answerChain, 
])

async function generateStandAloneQs(){
    const standAloneQs = await chain.invoke({ question });
    console.log(question)
    console.log(standAloneQs);
}
generateStandAloneQs();