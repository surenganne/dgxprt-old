import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface SolutionFeature {
  text: string;
}

interface SolutionCardProps {
  title: string;
  features: SolutionFeature[];
  ctaText: string;
  ctaLink: string;
}

export function SolutionCard({ title, features, ctaText, ctaLink }: SolutionCardProps) {
  return (
    <Card className="flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-primary-purple/10 border-primary-purple/10">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-purple to-primary-blue" />
              <span className="text-sm text-muted-foreground">{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 text-white border-0" 
          asChild
        >
          <a href={ctaLink}>{ctaText}</a>
        </Button>
      </CardFooter>
    </Card>
  );
}