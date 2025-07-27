// src/pages/ChatUI.tsx
import React, { useState, useRef, useEffect } from "react";
import "./ChatUI.css"; // For styling
import {
  MdSearch,
  MdMic,
  MdLink,
  MdImage,
  MdPeople,
  MdExtension,
} from "react-icons/md"; // For icons
import Accordion from "../components/Accordion"; // Import Accordion
import GoalFormContent from "../components/GoalFormContent"; // Import GoalFormContent

// Mock API response
const mockApiResponse = (message: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerCaseMessage = message.toLowerCase();
      if (
        lowerCaseMessage.includes("hello") ||
        lowerCaseMessage.includes("hi")
      ) {
        resolve("Hello there! How can I assist you with your finances today?");
      } else if (lowerCaseMessage.includes("finance goal")) {
        resolve(
          "What specifically about your finance goals would you like to know? E.g., saving for a house, retirement, or a new car?"
        );
      } else if (lowerCaseMessage.includes("optimize spending")) {
        resolve(
          "I can help you analyze your spending habits. Do you want to review recent transactions or set a budget?"
        );
      } else if (lowerCaseMessage.includes("personalize suggestion")) {
        resolve(
          "To give you personalized suggestions, I need more information about your financial situation. Can you tell me about your income, expenses, and current investments?"
        );
      } else if (
        lowerCaseMessage.includes("thank you") ||
        lowerCaseMessage.includes("thanks")
      ) {
        resolve("You're welcome! Is there anything else I can help you with?");
      } else {
        resolve(
          "I'm not sure how to respond to that. Could you please rephrase or ask about finance goals, spending, or personalized suggestions?"
        );
      }
    }, 1500); // Simulate network delay
  });
};

interface Message {
  text: string;
  sender: "user" | "ai";
}

const ChatUI: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = { text: inputValue, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const aiResponseText = await mockApiResponse(inputValue);
      const aiMessage: Message = { text: aiResponseText, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: Message = {
        text: "Sorry, something went wrong. Please try again.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const handleToggleGoalForm = () => {
    setIsGoalFormOpen((prev) => !prev);
  };

  return (
    <div className="chat-page-container">
      <header className="chat-header">
        <div className="header-buttons">
          <button
            className="header-button transition-effect"
            onClick={handleToggleGoalForm}
          >
            {" "}
            Set Finance Goal
          </button>
          <button className="header-button transition-effect">
            Personalize Suggestion
          </button>
          <button className="header-button transition-effect">
            Optimize Spending
          </button>
        </div>
      </header>
      <Accordion
        title="Create New Goal"
        isOpen={isGoalFormOpen}
        onToggle={handleToggleGoalForm} // Pass the same toggle function
      >
        <GoalFormContent />
      </Accordion>
      
      <h1>Speak to AI</h1>

      <div className="chat-window">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="message-bubble ai typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chat-input transition-effect"
            />
            <div className="input-icons">
              <button
                className="icon-button transition-effect"
                onClick={handleSendMessage}
                aria-label="Search"
              >
                <MdSearch size={24} />
              </button>
              <button
                className="icon-button transition-effect"
                aria-label="Expand"
              >
                <MdExtension size={24} />
              </button>
              <button
                className="icon-button transition-effect"
                aria-label="People"
              >
                <MdPeople size={24} />
              </button>
              <span className="icon-separator"></span> {/* Separator line */}
              <button
                className="icon-button transition-effect"
                aria-label="Image"
              >
                <MdImage size={24} />
              </button>
              <button
                className="icon-button transition-effect"
                aria-label="Link"
              >
                <MdLink size={24} />
              </button>
              <button
                className="icon-button microphone-button transition-effect"
                aria-label="Voice input"
              >
                <MdMic size={24} />
                <span className="microphone-wave"></span>{" "}
                {/* Animation element */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
