
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, File, ListOrdered } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-education-indigo to-education-purple flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="ml-2 font-bold text-xl">Teacher Toolkit</span>
            </div>
            <div className="flex items-center">
              <Link to="/auth">
                <Button variant="ghost" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              AI-Powered Teacher Toolkit
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Generate high-quality lesson plans, quizzes, and simulations with the power of AI
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth?tab=signup">
                <Button size="lg" className="font-semibold px-8">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="font-semibold px-8">
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-xl shadow-md p-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <File className="text-education-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lesson Plans</h3>
              <p className="text-muted-foreground">
                Generate comprehensive lesson plans with learning objectives, activities, and materials aligned with educational standards.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ListOrdered className="text-education-purple h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Quizzes</h3>
              <p className="text-muted-foreground">
                Create engaging quizzes with questions tagged by Bloom's taxonomy levels to measure different cognitive abilities.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Book className="text-education-green h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Virtual Labs</h3>
              <p className="text-muted-foreground">
                Discover and integrate interactive simulations and virtual labs to enhance student understanding through experiential learning.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 my-12 animate-fade-in">
            <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-education-blue/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-education-blue">1</span>
                </div>
                <h3 className="font-semibold mb-2">Enter Your Topic</h3>
                <p className="text-muted-foreground">
                  Provide a topic, syllabus text, or upload existing content to get started.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-education-purple/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-education-purple">2</span>
                </div>
                <h3 className="font-semibold mb-2">AI Generation</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your input and generates comprehensive educational materials.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-education-green/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-education-green">3</span>
                </div>
                <h3 className="font-semibold mb-2">Use & Customize</h3>
                <p className="text-muted-foreground">
                  Review, edit, and export your custom teaching materials for immediate use.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-education-indigo to-education-purple flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="ml-2 font-bold">Teacher Toolkit</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2023 Teacher Toolkit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
