import { Construction } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export function ComingSoon({
  title = "Coming Soon",
  description = "This feature is currently being built. Check back soon.",
}: ComingSoonProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
      <div className="text-center max-w-sm px-6 py-10 bg-card border rounded-2xl shadow-lg">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Construction className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
