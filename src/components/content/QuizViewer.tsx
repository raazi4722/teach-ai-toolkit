
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  bloomLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
  explanation: string;
}

const demoQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which of Newton's laws states that an object at rest will stay at rest unless acted upon by an external force?",
    options: [
      "First Law", 
      "Second Law", 
      "Third Law", 
      "Fourth Law"
    ],
    correctAnswer: 0,
    bloomLevel: "remember",
    explanation: "Newton's First Law, also known as the law of inertia, states that an object at rest will stay at rest, and an object in motion will stay in motion unless acted upon by an external force."
  },
  {
    id: "q2",
    question: "If a 2kg object experiences a force of 10N, what is its acceleration according to Newton's Second Law?",
    options: [
      "2 m/s²", 
      "5 m/s²", 
      "8 m/s²", 
      "20 m/s²"
    ],
    correctAnswer: 1,
    bloomLevel: "apply",
    explanation: "Using Newton's Second Law (F = ma), we have 10N = 2kg × a, so a = 5 m/s²."
  },
  {
    id: "q3",
    question: "A rocket propels itself forward by expelling gas backward. This is an example of which of Newton's laws?",
    options: [
      "First Law", 
      "Second Law", 
      "Third Law", 
      "Conservation of Energy"
    ],
    correctAnswer: 2,
    bloomLevel: "understand",
    explanation: "This illustrates Newton's Third Law: for every action (expelling gas backward), there is an equal and opposite reaction (rocket moving forward)."
  },
  {
    id: "q4",
    question: "Analyze this scenario: A book sits on a table without moving. What forces are acting on the book and why doesn't it move?",
    options: [
      "Only gravity acts on the book", 
      "Gravity and normal force are balanced, resulting in zero net force", 
      "The table exerts a greater force than gravity", 
      "There are no forces acting on the book"
    ],
    correctAnswer: 1,
    bloomLevel: "analyze",
    explanation: "The book experiences gravity pulling downward and the normal force from the table pushing upward with equal magnitude. These balanced forces result in zero net force, so the book remains stationary according to Newton's First Law."
  }
];

const QuizViewer = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number | null}>({});
  const [showResults, setShowResults] = useState(false);
  
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };
  
  const handleSubmit = () => {
    setShowResults(true);
  };
  
  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };
  
  const getScore = () => {
    let correct = 0;
    demoQuizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Newton's Laws Quiz</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Physics • High School • 4 Questions
            </p>
          </div>
          <div className="flex gap-2">
            {showResults ? (
              <Button size="sm" onClick={handleReset}>
                Try Again
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {showResults && (
            <div className="bg-muted p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium mb-2">Quiz Results</h3>
              <p>
                Score: {getScore()} / {demoQuizQuestions.length} correct (
                {Math.round((getScore() / demoQuizQuestions.length) * 100)}%)
              </p>
            </div>
          )}

          {demoQuizQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                  {index + 1}
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{question.question}</p>
                    <span className={`bloom-tag bloom-${question.bloomLevel}`}>
                      {question.bloomLevel.charAt(0).toUpperCase() + question.bloomLevel.slice(1)}
                    </span>
                  </div>
                  
                  <RadioGroup
                    className="mt-3"
                    value={selectedAnswers[question.id]?.toString()}
                    onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                    disabled={showResults}
                  >
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`${question.id}-${optionIndex}`}
                          className={showResults ? 
                            optionIndex === question.correctAnswer ? "text-green-500 border-green-500" : 
                            selectedAnswers[question.id] === optionIndex ? "text-red-500 border-red-500" : "" 
                            : ""
                          }
                        />
                        <Label
                          htmlFor={`${question.id}-${optionIndex}`}
                          className={showResults ?
                            optionIndex === question.correctAnswer ? "text-green-600" : 
                            selectedAnswers[question.id] === optionIndex ? "text-red-600" : "" 
                            : ""
                          }
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {showResults && (
                    <div className="mt-3 text-sm bg-muted p-3 rounded-md">
                      <p className="font-medium mb-1">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
              {index < demoQuizQuestions.length - 1 && <Separator />}
            </div>
          ))}
          
          {!showResults && (
            <Button onClick={handleSubmit} className="w-full mt-4" size="lg">
              Submit Quiz
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizViewer;
