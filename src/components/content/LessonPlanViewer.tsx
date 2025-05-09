
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LearningObjective {
  id: string;
  text: string;
  bloomLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
}

interface LessonSection {
  title: string;
  duration: string;
  content: string[];
}

interface LessonPlanProps {
  title: string;
  subject: string;
  grade: string;
  duration: string;
  objectives: LearningObjective[];
  sections: LessonSection[];
}

const demoLessonPlan: LessonPlanProps = {
  title: "Introduction to Newton's Laws of Motion",
  subject: "Physics",
  grade: "High School",
  duration: "45 minutes",
  objectives: [
    { id: "1", text: "Define and state Newton's three laws of motion", bloomLevel: "remember" },
    { id: "2", text: "Explain the relationship between force, mass, and acceleration", bloomLevel: "understand" },
    { id: "3", text: "Apply Newton's laws to predict the motion of objects", bloomLevel: "apply" },
    { id: "4", text: "Analyze real-world scenarios using Newton's laws", bloomLevel: "analyze" }
  ],
  sections: [
    {
      title: "Introduction and Warm-up",
      duration: "5 minutes",
      content: [
        "Begin with a brief demonstration: roll a ball across the room and ask students to explain why it eventually stops.",
        "Use this to introduce the concept of forces and their effects on motion."
      ]
    },
    {
      title: "Direct Instruction: Newton's First Law",
      duration: "10 minutes",
      content: [
        "Introduce Newton's First Law: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
        "Discuss the concept of inertia and relate it to everyday examples.",
        "Show video demonstration of inertia with objects on a moving cart."
      ]
    },
    {
      title: "Interactive Activity: Second Law",
      duration: "15 minutes",
      content: [
        "Introduce Newton's Second Law: F = ma",
        "Divide students into small groups for hands-on experiment using toy cars and different masses.",
        "Have students measure and calculate the relationship between force, mass, and acceleration.",
        "Guide students to record their observations and formulate conclusions."
      ]
    },
    {
      title: "Demonstration: Third Law",
      duration: "10 minutes",
      content: [
        "Introduce Newton's Third Law: For every action, there is an equal and opposite reaction.",
        "Demonstrate with balloon rockets, releasing air from inflated balloons.",
        "Connect to real-world applications like rocket propulsion and swimming."
      ]
    },
    {
      title: "Conclusion and Assessment",
      duration: "5 minutes",
      content: [
        "Summarize the three laws and their relationships to each other.",
        "Exit ticket: Have students write one everyday example of each law."
      ]
    }
  ]
};

const LessonPlanViewer = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{demoLessonPlan.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <span>{demoLessonPlan.subject}</span>
              <span>•</span>
              <span>{demoLessonPlan.grade}</span>
              <span>•</span>
              <span>{demoLessonPlan.duration}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="outline" size="sm">Export PDF</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-3">Learning Objectives</h3>
            <ul className="space-y-2">
              {demoLessonPlan.objectives.map((objective) => (
                <li key={objective.id} className="flex items-start">
                  <span className={`bloom-tag bloom-${objective.bloomLevel} mr-2 mt-0.5`}>
                    {objective.bloomLevel.charAt(0).toUpperCase() + objective.bloomLevel.slice(1)}
                  </span>
                  <span>{objective.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section className="space-y-6">
            {demoLessonPlan.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{section.title}</h3>
                  <span className="text-sm text-muted-foreground">{section.duration}</span>
                </div>
                <ul className="space-y-2 list-disc pl-5">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonPlanViewer;
