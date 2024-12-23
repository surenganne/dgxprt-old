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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-purple" />
              <span className="text-sm text-muted-foreground">{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" asChild>
          <a href={ctaLink}>{ctaText}</a>
        </Button>
      </CardFooter>
    </Card>
  );
}