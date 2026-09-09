import { MOVEFEST_ACTIVITIES, MOVEFEST_REASONS, MOVEFEST_WHEN } from "@/lib/events";

// The full "Why You Should Be There" breakdown shared by the home-page MoveFest
// banner and the Newsroom page.
export function MoveFestDetails({ className = "" }: { className?: string }) {
  return (
    <div className={`text-left ${className}`}>
      <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-1">
        Why You Should Be There
      </h3>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-5">
        5 Reasons to Attend MoveFest
      </p>

      <ol className="space-y-3 mb-10">
        {MOVEFEST_REASONS.map((reason, i) => (
          <li key={i} className="flex gap-3 text-muted-foreground">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span>{reason}</span>
          </li>
        ))}
      </ol>

      <h4 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4">
        Benefits of Every Activity
      </h4>
      <div className="grid sm:grid-cols-2 gap-4">
        {MOVEFEST_ACTIVITIES.map((activity) => (
          <div
            key={activity.name}
            className="rounded-2xl border border-primary/15 bg-primary/5 p-5"
          >
            <p className="font-semibold text-foreground mb-3">
              <span className="mr-2 text-lg" aria-hidden="true">
                {activity.icon}
              </span>
              {activity.name}
            </p>
            <ul className="space-y-1.5">
              {activity.benefits.map((benefit, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary" aria-hidden="true">
                    •
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center font-medium text-foreground">{MOVEFEST_WHEN}</p>
    </div>
  );
}
