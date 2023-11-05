function formatConvHistory(messages) {
    return messages.map((message, i) => {
        if (i % 2 === 0){
            return `Human: ${message}`
        } else {
            return `AI: ${message}`
        }
    }).join('\n')
}

//"Human: How long does it take to get a code review? AI: The turnaround time for a code review is 
// roughly 24 hours after submitting your Solo Project for review. You will be notified when your code 
// review is complete in the #code-reviews channel on Discord."