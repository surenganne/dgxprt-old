import { UserLayout } from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Beaker, FileText, AlertTriangle } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold mb-6">Welcome to DGXPRT</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary-purple" />
                Chemical Register
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage your chemical inventory
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white hover:opacity-90"
                onClick={() => navigate("/user/chemicals")}
              >
                View Register
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-purple" />
                SDS Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Access safety data sheets for your chemicals
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white hover:opacity-90"
                onClick={() => navigate("/user/sds")}
              >
                View Documents
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary-purple" />
                Risk Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage and review chemical risk assessments
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white hover:opacity-90"
                onClick={() => navigate("/user/risk-assessments")}
              >
                View Assessments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}

export default UserDashboard;