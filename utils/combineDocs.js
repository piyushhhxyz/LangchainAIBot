// to Extract texts from Array of Objects weget from retriever.
function combineDocuments(docs){
    return docs.map(doc => doc.pageContent).join('\n\n')
}

module.exports = { combineDocuments }; 