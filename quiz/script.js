const QUESTION = document.querySelector('.question-title')
const ANSWER = document.querySelectorAll('.answer')
const IS_DEV = isDev(window.location.href)
let ALL_QUESTION = []

// SET QUESTION
if (IS_DEV) {
    ALL_QUESTION = [
            {
                "type": "multiple",
                "difficulty": "medium",
                "category": "General Knowledge",
                "question": "What is the name of the popular animatronic singing fish prop, singing such hits such as &quot;Don&#039;t Worry, Be Happy&quot;?",
                "correct_answer": "Big Mouth Billy Bass",
                "incorrect_answers": [
                    "Big Billy Bass",
                    "Singing Fish",
                    "Sardeen"
                ]
            }
        ]
} else {
    const question = fetchJSON()
    ALL_QUESTION = question.results
}


// RENDER QUESTION
for (const quest of ALL_QUESTION) {
    QUESTION.innerHTML = quest.question
    const answers = quest.incorrect_answers.concat(quest.correct_answer)
    for (let i = 0; i < ANSWER.length; i++) {
        ANSWER[i].textContent = answers[i]
    }
}