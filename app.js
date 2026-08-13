import Groq from "groq-sdk";


const groq = new Groq();
async function main(){
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: "Hello"
            }
        ]
    })
    console.log(completion.choices[0]?.message?.content);
}

main().catch(console.error);