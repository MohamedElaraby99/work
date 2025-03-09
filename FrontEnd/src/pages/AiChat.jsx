import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import "./../styles/AiChat.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const Ai = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState("");
  const [openai, setOpenai] = useState(null);

  useEffect(() => {
    // Access the environment variable correctly
    setApiToken(process.env.REACT_APP_KEY);
  }, []);

  useEffect(() => {
    // Initialize the OpenAI client once the API token is set
    if (apiToken) {
      const openaiInstance = new OpenAI({
        apiKey: apiToken,
        baseURL: "https://models.inference.ai.azure.com",
        dangerouslyAllowBrowser: true,
      });
      setOpenai(openaiInstance);
    }
  }, [apiToken]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    setMessages([...messages, { sender: "user", text: input }]);
    setLoading(true);
    setInput("");

    try {
      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "" },
          { role: "user", content: input },
        ],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1,
      });

      const aiResponse = response.choices[0].message.content;
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: aiResponse },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("تم نسخ الرسالة!");
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-container">
      <ToastContainer />
      <div className="chat-display">
        {loading && (
          <div className="loader-container">
            <Loader />
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "user" ? "user-message" : "ai-message"
            }`}
            onClick={() =>
              message.sender === "ai" && handleCopyMessage(message.text)
            }
          >
            {message.text.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالة..."
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>إرسال</button>
      </div>
    </div>
  );
};

export default Ai;
