import { StudyGuide } from "../types";

/**
 * Returns dummy study material instantly (no API calls)
 */
export const generateStudyMaterial = async (
  inputContent: string,
  inputType: 'text' | 'file' | 'url',
  mimeType?: string
): Promise<StudyGuide> => {
  
  // Return dummy data immediately
  const dummyData: StudyGuide = {
    title: "Sample Study Guide",
    summary: `This is a dummy summary generated from your ${inputType} content: "${inputContent.substring(0, 50)}...". The actual API would analyze this content and create a comprehensive study guide with summaries, flashcards, and quizzes.`,
    flashcards: [
      { front: "What is the main topic?", back: "This is a placeholder flashcard" },
      { front: "Key concept to remember", back: "Important information goes here" },
      { front: "Third study point", back: "The answer or definition" }
    ],
    quiz: [
      { 
        question: "What does this sample demonstrate?", 
        options: ["API Integration", "Dummy Data", "Error Handling", "File Upload"],
        answer: "Dummy Data"
      },
      {
        question: "What type of input was provided?",
        options: ["Text", "Image", "PDF", "URL"],
        answer: inputType.charAt(0).toUpperCase() + inputType.slice(1)
      }
    ]
  };

  // Simulate a small delay (optional, remove if you want instant)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return dummyData;
};