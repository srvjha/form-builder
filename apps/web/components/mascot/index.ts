export { Brix } from "./brix";
export { SpeechBubble } from "./speech-bubble";
export { MascotScene } from "./mascot-scene";
export { FloatingMascot } from "./floating-mascot";

/* Individual characters */
export { Rex }  from "./characters/rex";
export { Flux } from "./characters/flux";

/* Character metadata — used on the /characters page */
export const CREW = [
  {
    id:          "brix",
    name:        "Brix",
    title:       "The Builder",
    color:       "#FFD600",
    badge:       "FORM BUILDER",
    tagline:     "No excuses. Just forms.",
    description: "Brix shows up whenever you're building. Form fields, logic, layout — that's his turf. Direct, no-nonsense, always ready to get to work.",
    appearsIn:   ["Form Builder", "Landing Page", "Dashboard"],
    voice:       ["Let's build.", "Add a field. Any field.", "This form won't build itself."],
  },
  {
    id:          "rex",
    name:        "Rex",
    title:       "The Analyst",
    color:       "#00C853",
    badge:       "ANALYTICS",
    tagline:     "Numbers don't lie. People do.",
    description: "Rex lives in the data. He tracks every response, measures every drop-off, and will tell you exactly which question is killing your completion rate.",
    appearsIn:   ["Analytics", "Responses", "Dashboard stats"],
    voice:       ["23% drop-off on question 3.", "Completion rate: acceptable.", "I've seen worse. Not much worse."],
  },
  {
    id:          "flux",
    name:        "Flux",
    title:       "The Messenger",
    color:       "#FF3B00",
    badge:       "PUBLISH",
    tagline:     "Ship it. Now.",
    description: "Flux has one job: get your form out there. The moment you hit publish, he's already thrown the paper airplane. Impatient, fast, always pushing you to launch.",
    appearsIn:   ["Publish page", "Share settings", "Public form"],
    voice:       ["Ready? Ship it.", "The link is live. Go.", "Waiting is not a strategy."],
  },
] as const;
