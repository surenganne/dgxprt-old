import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreateOwner = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateOwner = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://zrmjzuebsupnwuekzfio.supabase.co/functions/v1/create-owner',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success("Owner user created successfully!");
    } catch (error) {
      console.error('Error creating owner:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Create Owner User</h2>
          <p className="text-muted-foreground mb-8">
            This will create the owner user with email: owner@dgxprt.ai
          </p>
        </div>
        <Button
          onClick={handleCreateOwner}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating..." : "Create Owner User"}
        </Button>
      </div>
    </div>
  );
};

export default CreateOwner;