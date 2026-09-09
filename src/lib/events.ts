export const MOVEFEST_REGISTRATION_URL = "https://movefest-hub.vercel.app/";

export const MOVEFEST_WHEN =
  "Thursday, 1st October 2026  •  6:30 AM  •  TakeHealth Facility/Arena";

// "Why You Should Be There" — 5 reasons to attend MoveFest.
export const MOVEFEST_REASONS = [
  "Get a free fitness test — know your actual starting point (strength, endurance, mobility) instead of guessing.",
  "Free wellness screening on the spot — catch early warning signs before they become real problems.",
  "Talk to a doctor, one-on-one — real answers to your health questions, no appointment needed.",
  "Move with your community — shared energy gets you further than solo willpower ever does.",
  "Walk away with a plan, not just a workout — leave knowing exactly what to work on next.",
];

// Benefits of every activity on the day.
export const MOVEFEST_ACTIVITIES: {
  icon: string;
  name: string;
  benefits: string[];
}[] = [
  {
    icon: "🚶",
    name: "FitWalk",
    benefits: [
      "Low-impact cardio that's easy on the joints",
      "Boosts circulation and heart health",
      "Clears the mind before the day begins",
      "Builds walking stamina for everyday life",
      "Perfect entry point for beginners",
    ],
  },
  {
    icon: "💃",
    name: "Group Aerobics",
    benefits: [
      "Raises heart rate for real cardiovascular benefit",
      "Improves coordination and rhythm",
      "Burns calories while feeling like fun, not work",
      "Releases endorphins — an instant mood lift",
      "Group format keeps motivation high",
    ],
  },
  {
    icon: "⏱️",
    name: "Tabata Workout",
    benefits: [
      "Maximum calorie burn in minimal time",
      "Boosts metabolism for hours after the session",
      "Builds explosive strength and power",
      "Improves anaerobic endurance fast",
      "Trains the body to push past perceived limits",
    ],
  },
  {
    icon: "💪",
    name: "Street Workout / Fitness Challenge",
    benefits: [
      "Builds functional, real-world strength",
      "Tests and improves core stability",
      "Sparks healthy competition and drive",
      "Builds confidence through visible progress",
      "Introduces bodyweight training anyone can continue at home",
    ],
  },
  {
    icon: "🎮",
    name: "Fitness Games",
    benefits: [
      "Makes fitness feel playful, not like a chore",
      "Improves agility and reaction time",
      "Encourages teamwork and social bonding",
      "Reduces stress through laughter and play",
      "Proves fitness doesn't have to be intimidating",
    ],
  },
];
