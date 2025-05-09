
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const GeneratorForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    topic: "",
    grade: "",
    contentType: "lesson",
    contentText: "",
    videoUrl: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading and processing
    toast({
      title: "Processing your request",
      description: "Our AI is generating your content...",
    });

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Content generated successfully!",
        description: "Your lesson materials are ready to review.",
      });
    }, 2500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Educational Content</CardTitle>
        <CardDescription>
          Use AI to generate customized educational materials for your classroom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or Concept</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="e.g., Photosynthesis, World War II, Shakespeare"
              required
              value={formData.topic}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("grade", value)}
                value={formData.grade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elementary">Elementary School</SelectItem>
                  <SelectItem value="middle">Middle School</SelectItem>
                  <SelectItem value="high">High School</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("contentType", value)}
                value={formData.contentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lesson">Lesson Plan</SelectItem>
                  <SelectItem value="objectives">Learning Objectives</SelectItem>
                  <SelectItem value="quiz">Quiz Questions</SelectItem>
                  <SelectItem value="lab">Virtual Lab</SelectItem>
                  <SelectItem value="all">Complete Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-4">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="video">Video URL</TabsTrigger>
              <TabsTrigger value="file" className="hidden md:inline-flex">File Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <div className="space-y-2">
                <Label htmlFor="contentText">Additional Information or Syllabus Text (Optional)</Label>
                <Textarea
                  id="contentText"
                  name="contentText"
                  placeholder="Paste any additional context, requirements, or syllabus text here..."
                  className="min-h-[120px]"
                  value={formData.contentText}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="video">
              <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube Video URL</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  We'll automatically transcribe and analyze the content of the video
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="file">
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Upload Document (PDF, DOCX)</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <p className="text-sm text-muted-foreground mb-2">
                    Drop your file here or click to browse
                  </p>
                  <Input
                    id="fileUpload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                  />
                  <Button variant="outline" size="sm" type="button">
                    Select File
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !formData.topic || !formData.grade}
        >
          {isLoading ? "Generating..." : "Generate Content"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeneratorForm;
