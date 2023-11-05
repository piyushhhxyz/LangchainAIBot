//Runnable Sequence for Complex-long Chains

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { RunnableSequence } = require("langchain/schema/runnable");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PromptTemplate } = require("langchain/prompts");
const { StringOutputParser } = require("langchain/schema/output_parser");


const url = process.env.SUPABASE_URL_AGI_CHATBOT;
const privateKey = process.env.SUPABASE_API_KEY;
const openAIApiKey = process.env.OPENAI_API_KEY;


const llm = new ChatOpenAI({ openAIApiKey });
const embeddings =new OpenAIEmbeddings({ openAIApiKey });
const client = createClient(url, privateKey);


const input = "i dont liked mondays"; //1st.
console.log("input: "+input);
const punctuationTemplate = `Given a sentence, add punctuation where needed. 
                    sentence: {input}
                    sentence with punctuation:`; //2nd;
const grammarTemplate = `Given a sentence correct the grammar.
                sentence: {punctuated_sentence}
                sentence with correct grammar:`; //3rd
const translationTemplate = "translate the following to japanese:{sentence}"; //4th

const punctutationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);
const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);
const translatePrompt = PromptTemplate.fromTemplate(translationTemplate);

const chain = RunnableSequence.from([
    punctutationPrompt,
    llm,
    new StringOutputParser(),
    // prev => console.log("punctuated_sentence: "+prev),
    { punctuated_sentence: prev => prev },
    grammarPrompt,
    llm,
    new StringOutputParser(),
])

async function main(){
    const response = await chain.invoke({ input });
    console.log(response);
}
main();
