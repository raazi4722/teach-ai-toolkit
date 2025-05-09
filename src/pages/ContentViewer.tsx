
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import LessonPlanViewer from "@/components/content/LessonPlanViewer";
import QuizViewer from "@/components/content/QuizViewer";

const ContentViewer = () => {
  const { contentId } = useParams();
  
  // In a real implementation, this would fetch the content based on the ID
  // Here we're just doing a simple check to determine what to show
  
  const isQuiz = contentId?.startsWith('quiz');
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {isQuiz ? <QuizViewer /> : <LessonPlanViewer />}
      </div>
    </AppLayout>
  );
};

export default ContentViewer;
