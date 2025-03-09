import React, { useState } from "react";
import { toast } from "react-toastify";

const PasteFromAiComponent = ({ onAddQuestions }) => {
  const [jsonInput, setJsonInput] = useState("");

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleAddQuestions = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (parsedJson.questions && Array.isArray(parsedJson.questions)) {
        // Validate the structure of each question
        const validQuestions = parsedJson.questions.filter(
          (question) =>
            question.question &&
            Array.isArray(question.options) &&
            typeof question.correctAnswer === "number"
        );

        if (validQuestions.length === parsedJson.questions.length) {
          // Send the questions to the parent component
          onAddQuestions(validQuestions);
          setJsonInput(""); // Clear the input after adding questions
          toast.success("Questions added successfully!");
        } else {
          toast.error("Invalid format for some questions.");
        }
      } else {
        toast.error("Invalid JSON format");
      }
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  return (
    <div>
      <textarea
        value={jsonInput}
        onChange={handleJsonChange}
        placeholder="Paste JSON here"
        rows="10"
        cols="50"
      />
      <button onClick={handleAddQuestions}>Add Questions</button>
    </div>
  );
};

export default PasteFromAiComponent;
