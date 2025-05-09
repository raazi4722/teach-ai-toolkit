
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import LessonPlanViewer from "@/components/content/LessonPlanViewer";
import QuizViewer from "@/components/content/QuizViewer";
import VirtualLabViewer from "@/components/content/VirtualLabViewer";

const ContentViewer = () => {
  const { contentId } = useParams();
  
  // Determine content type based on URL or ID pattern
  const isQuiz = contentId?.includes('quiz') || contentId?.startsWith('q');
  const isLab = contentId?.includes('lab') || contentId?.startsWith('l');
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {isQuiz ? (
          <QuizViewer />
        ) : isLab ? (
          <VirtualLabViewer />
        ) : (
          <LessonPlanViewer />
        )}
      </div>
    </AppLayout>
  );
};

export default ContentViewer;
