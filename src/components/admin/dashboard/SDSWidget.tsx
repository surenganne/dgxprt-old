import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const SDSWidget = () => {
  const { data: sdsStats } = useQuery({
    queryKey: ["sds-stats"],
    queryFn: async () => {
      const { data: totalData, count: totalCount } = await supabase
        .from("sds_documents")
        .select("*", { count: "exact" });

      const { data: pendingData, count: pendingCount } = await supabase
        .from("sds_documents")
        .select("*", { count: "exact" })
        .eq("status", "pending_review");

      return {
        total: totalCount || 0,
        pending: pendingCount || 0,
      };
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">SDS Documents</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{sdsStats?.total || 0}</div>
        {sdsStats?.pending ? (
          <p className="text-xs text-muted-foreground">
            {sdsStats.pending} pending review
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
};