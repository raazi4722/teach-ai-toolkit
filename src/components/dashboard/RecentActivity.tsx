
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    action: "Created a lesson plan",
    subject: "Newton's Laws of Motion",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    action: "Generated quiz questions",
    subject: "World War II",
    timestamp: "Yesterday",
  },
  {
    id: 3,
    action: "Created learning objectives",
    subject: "Cell Biology",
    timestamp: "2 days ago",
  },
];

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.subject}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
