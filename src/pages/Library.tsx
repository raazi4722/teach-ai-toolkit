
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "lab";
  subject: string;
  createdAt: string;
  bloomTags?: string[];
}

const contentItems: ContentItem[] = [
  {
    id: "lesson-1",
    title: "Newton's Laws of Motion",
    type: "lesson",
    subject: "Physics",
    createdAt: "2023-05-20",
    bloomTags: ["understand", "apply"]
  },
  {
    id: "quiz-1",
    title: "World War II Quiz",
    type: "quiz",
    subject: "History",
    createdAt: "2023-05-19",
    bloomTags: ["remember", "analyze"]
  },
  {
    id: "lesson-2",
    title: "Cell Biology",
    type: "lesson",
    subject: "Biology",
    createdAt: "2023-05-15",
    bloomTags: ["understand", "analyze", "create"]
  },
  {
    id: "lab-1",
    title: "Circuit Building Simulation",
    type: "lab",
    subject: "Physics",
    createdAt: "2023-05-10"
  },
  {
    id: "quiz-2",
    title: "Spanish Verb Conjugation",
    type: "quiz",
    subject: "Languages",
    createdAt: "2023-05-08",
    bloomTags: ["remember", "apply"]
  },
  {
    id: "lesson-3",
    title: "Introduction to Poetry",
    type: "lesson",
    subject: "Literature",
    createdAt: "2023-05-05",
    bloomTags: ["understand", "evaluate", "create"]
  }
];

const Library = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
            <p className="text-muted-foreground">Access and manage all your educational content</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search content..."
                className="pl-8"
              />
            </div>
            <Button>Create New</Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="lessons">Lesson Plans</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-semibold">
                        {item.title}
                      </CardTitle>
                      <Badge variant="outline">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="secondary" className="font-normal">
                        {item.subject}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {item.bloomTags && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.bloomTags.map((tag) => (
                          <span key={tag} className={`bloom-tag bloom-${tag}`}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t flex justify-between">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="lessons" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentItems
                .filter((item) => item.type === "lesson")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-semibold">
                          {item.title}
                        </CardTitle>
                        <Badge variant="outline">Lesson</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <Badge variant="secondary" className="font-normal">
                          {item.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {item.bloomTags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.bloomTags.map((tag) => (
                            <span key={tag} className={`bloom-tag bloom-${tag}`}>
                              {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          {/* Similar implementation for quizzes and labs tabs */}
          <TabsContent value="quizzes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentItems
                .filter((item) => item.type === "quiz")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    {/* Card content similar to above */}
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-semibold">
                          {item.title}
                        </CardTitle>
                        <Badge variant="outline">Quiz</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <Badge variant="secondary" className="font-normal">
                          {item.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {item.bloomTags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.bloomTags.map((tag) => (
                            <span key={tag} className={`bloom-tag bloom-${tag}`}>
                              {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="labs" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentItems
                .filter((item) => item.type === "lab")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-semibold">
                          {item.title}
                        </CardTitle>
                        <Badge variant="outline">Lab</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <Badge variant="secondary" className="font-normal">
                          {item.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Library;
