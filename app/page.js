"use client";

import { useEffect, useState } from "react";
import { getIntents } from "../app/intents";
import stringSimilarity from "string-similarity";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const intents = getIntents();

  useEffect(() => {
    addBotMessage("Hello! How can I assist you today?");
  }, []);

  const addBotMessage = (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser: false }]);
  };

  const addUserMessage = (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);
    processUserInput(text);
  };

  const processUserInput = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();

    let bestMatch = { intent: null, similarity: 0 };

    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        const similarity = stringSimilarity.compareTwoStrings(
          lowerCaseInput,
          pattern.toLowerCase()
        );

        if (similarity > bestMatch.similarity) {
          bestMatch = { intent, similarity };
        }
      }
    }

    if (bestMatch.intent) {
      const randomIndex = Math.floor(
        Math.random() * bestMatch.intent.responses.length
      );
      addBotMessage(bestMatch.intent.responses[randomIndex]);
    } else {
      addBotMessage("I'm sorry, I don't understand.");
    }
  };

  return (
    <main>
      <div
        style={{
          height: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              backgroundColor: message.isUser ? "#f7f7f7" : "white",
            }}
          >
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addUserMessage(e.target.value);
            e.target.value = "";
          }
        }}
        style={{ width: "100%", marginTop: "10px" }}
      />
    </main>
  );
}
