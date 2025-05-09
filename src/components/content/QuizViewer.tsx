import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Save, Share2, Download } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  bloomLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

// Helper function to safely parse JSON content
const parseQuizContent = (content: Json): QuizQuestion[] => {
  try {
    if (typeof content === 'object' && content !== null && 'questions' in content) {
      return (content.questions as any[]).map(q => ({
        id: q.id || `q${Math.random().toString(36).substring(2, 10)}`,
        question: q.question || "",
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        bloomLevel: q.bloomLevel || "remember",
        explanation: q.explanation || ""
      }));
    }
    return [];
  } catch (error) {
    console.error("Error parsing quiz content:", error);
    return [];
  }
};

// Helper function to convert QuizQuestion[] to Json compatible format
const convertQuestionsToJson = (questions: QuizQuestion[]): Json => {
  return {
    questions: questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      bloomLevel: q.bloomLevel,
      explanation: q.explanation
    }))
  } as Json;
};

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
  const { contentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number | null}>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!contentId) {
        setQuiz({
          id: "demo",
          title: "Newton's Laws Quiz",
          subject: "Physics",
          grade: "High School",
          questions: demoQuizQuestions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("content")
          .select("*")
          .eq("id", contentId)
          .eq("type", "quiz")
          .single();
        
        if (error) throw error;
        
        if (data) {
          const quizQuestions = parseQuizContent(data.content);
          setQuiz({
            id: data.id,
            title: data.title,
            subject: data.subject || "",
            grade: data.grade_level || "",
            questions: quizQuestions,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          });
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast({
          title: "Error",
          description: "Failed to load quiz. Using demo content instead.",
          variant: "destructive",
        });
        
        // Fallback to demo content
        setQuiz({
          id: "demo",
          title: "Newton's Laws Quiz",
          subject: "Physics",
          grade: "High School",
          questions: demoQuizQuestions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuiz();
  }, [contentId, toast]);
  
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
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save this quiz.",
      });
      return;
    }
    
    if (quiz?.id === "demo") {
      setIsSaving(true);
      
      try {
        // Use the helper function to properly convert the quiz questions to Json
        const quizContent = convertQuestionsToJson(quiz.questions);
        
        const { data, error } = await supabase
          .from("content")
          .insert({
            user_id: user.id,
            title: quiz.title,
            type: "quiz",
            subject: quiz.subject,
            grade_level: quiz.grade,
            bloom_tags: quiz.questions.map(q => q.bloomLevel),
            content: quizContent,
            status: "published"
          })
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Quiz saved",
          description: "The quiz has been saved to your library.",
        });
        
        if (data) {
          navigate(`/quizzes/${data.id}`);
        }
      } catch (error) {
        console.error("Error saving quiz:", error);
        toast({
          title: "Save failed",
          description: "Failed to save the quiz. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  const handleExport = () => {
    if (!quiz) return;
    
    const quizData = {
      title: quiz.title,
      subject: quiz.subject,
      grade: quiz.grade,
      questions: quiz.questions,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(quizData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${quiz.title.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export successful",
      description: "The quiz has been exported as JSON.",
    });
  };
  
  const getScore = () => {
    if (!quiz) return 0;
    
    let correct = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (!quiz) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">No quiz found. Please return to the library and select another quiz.</p>
          <Button className="w-full mt-4" onClick={() => navigate('/library')}>
            Back to Library
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {quiz.subject} • {quiz.grade} • {quiz.questions.length} Questions
            </p>
          </div>
          <div className="flex gap-2">
            {showResults ? (
              <Button size="sm" onClick={handleReset}>
                Try Again
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                {quiz.id === "demo" && (
                  <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                    Save
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
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
                Score: {getScore()} / {quiz.questions.length} correct (
                {Math.round((getScore() / quiz.questions.length) * 100)}%)
              </p>
            </div>
          )}

          {quiz.questions.map((question, index) => (
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
              {index < quiz.questions.length - 1 && <Separator />}
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
