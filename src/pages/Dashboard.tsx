
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ResourceCard from "@/components/dashboard/ResourceCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Link } from "react-router-dom";
import { Book, File, ListOrdered, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, Teacher!</h1>
          <p className="text-muted-foreground">
            Create, manage, and share educational resources powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResourceCard
            title="Generate Lesson Plan"
            description="Create detailed lesson plans with activities and materials"
            icon={<File size={24} />}
            bgColor="bg-gradient-to-br from-education-blue to-education-indigo"
            onClick={() => window.location.href = '/generator'}
          />
          
          <ResourceCard
            title="Create Quiz"
            description="Generate questions with varying difficulty levels"
            icon={<ListOrdered size={24} />}
            bgColor="bg-gradient-to-br from-education-purple to-education-pink"
            onClick={() => window.location.href = '/generator?type=quiz'}
          />
          
          <ResourceCard
            title="Find Learning Materials"
            description="Discover simulations and interactive content"
            icon={<Book size={24} />}
            bgColor="bg-gradient-to-br from-education-teal to-education-green"
            onClick={() => window.location.href = '/library'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 bg-muted/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <LayoutDashboard size={20} className="mr-2" /> Recent Content
                  </h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/library">View All</Link>
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <DashboardCard
                    title="Newton's Laws of Motion"
                    badge="Physics"
                    badgeVariant="outline"
                    onClick={() => window.location.href = '/content/lesson-1'}
                  >
                    <p className="text-sm text-muted-foreground">
                      Lesson plan with interactive demonstrations and assessments
                    </p>
                    <div className="flex mt-4 space-x-2">
                      <span className="bloom-tag bloom-understand">Understand</span>
                      <span className="bloom-tag bloom-apply">Apply</span>
                    </div>
                  </DashboardCard>
                  
                  <DashboardCard
                    title="World War II Quiz"
                    badge="History"
                    badgeVariant="outline"
                    onClick={() => window.location.href = '/content/quiz-1'}
                  >
                    <p className="text-sm text-muted-foreground">
                      15 multiple choice questions covering key events and figures
                    </p>
                    <div className="flex mt-4 space-x-2">
                      <span className="bloom-tag bloom-remember">Remember</span>
                      <span className="bloom-tag bloom-analyze">Analyze</span>
                    </div>
                  </DashboardCard>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
