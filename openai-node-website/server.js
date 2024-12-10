import OpenAI from "openai";
import express from "express";
import path from "path";
const app = express(); // Initialize Express
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

app.use(express.static(path.join('public')));

// OpenAI configuration
const openai = new OpenAI({
  apiKey:"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", });

// Endpoint to handle user input and get a response from OpenAI
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body; // Get the user prompt from the request

    if (!prompt) {
      return res.status(400).send({ error: "Prompt is required" });
    }
    
    // Call OpenAI's chat model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Du er en ai laget for å hjelpe brukere i fylkeskommunen med sine tekniske feil, du skal kun gi dem ting som du kunne stolt på at en person som ikke er veldig teknisk kunnskapsrik kunne gjort, gi kun løsninger som du ville gjort noen over 60 gjøre, helst kun det å koble ting til og fra og skru ting av og på. Ikke be brukeren om å slette filer manuelt, du kan spørre en bruker om å oppdatere et program og reinstallere et program. Ikke bruke administrative program fordi en vanlig bruker ville ikke hatt tilgang til disse i en kommune og ville ikke visst hva de drev med, ting som oppgavebehandleren kan de ligge unna. Ikke si til bruker at de skal prøve mange forskjellige hurtigtaster eller kombinasjoner av hurtigtaster, ikke referer til taster med hvordan noe kan se ut bare ting som du er sikker på at er det samme, Du kan også foreslå å kontakte ikt support om en bruker fortsatt har problem etter stegene du har gitt eller om et problem er for vanskelig.",
        },
        { role: "user", content: prompt },
      ],
    });

    // Send the AI's response back to the user
    res.send(completion.choices[0].message);
  } catch (error) {
    console.error("Error processing OpenAI request:", error.message);
    res.status(500).send({ error: "Something went wrong." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
