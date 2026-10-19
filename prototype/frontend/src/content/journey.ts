export type JourneyStatus = "Root" | "Past experience" | "Ongoing development" | "Current practice" | "Future direction";

export type JourneyVisual =
  | "curiosity"
  | "cosmos"
  | "direction"
  | "inward"
  | "resilience"
  | "creation"
  | "systems"
  | "horizon";

export type JourneyChapter = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  body: string[];
  quote: string;
  status: JourneyStatus;
  visual: JourneyVisual;
};

export const journeyIntroduction = [
  "I've always been curious about how things work. Before I had a clear direction, I had curiosity: an instinct to experiment, explore possibilities, and follow the questions that caught my attention.",
  "That curiosity once pointed toward the universe itself. Space, dark matter, and the mysteries of physics fascinated me. Electronics and Communication Engineering later gave those questions a different shape, but the fascination with the unknown never disappeared.",
  "What follows is not a finished success story. It is an honest map of a person still learning, building foundations, and working out what he is capable of becoming.",
];

export const journeyChapters: JourneyChapter[] = [
  {
    id: "curiosity-before-direction",
    number: "01",
    title: "Curiosity Before Direction",
    subtitle: "The first signal",
    body: [
      "As a kid, I was drawn to experimenting, exploring possibilities, and finding answers to questions that caught my attention.",
      "There was no clear academic or career direction yet. There was simply the habit of looking closer and asking how something worked.",
    ],
    quote: "Before I knew what I wanted to become, I wanted to understand how things worked.",
    status: "Root",
    visual: "curiosity",
  },
  {
    id: "looking-toward-the-cosmos",
    number: "02",
    title: "Looking Toward the Cosmos",
    subtitle: "Wonder at a larger scale",
    body: [
      "Space, dark matter, physics, and the unknown became early fascinations. They were questions about what exists beyond what we can see—and why it works at all.",
      "That interest remains part of how I look at the world: with room for scale, mystery, and unanswered questions.",
    ],
    quote: "Some questions make you look beyond the world. Others make you look deeper into it.",
    status: "Past experience",
    visual: "cosmos",
  },
  {
    id: "a-change-in-direction",
    number: "03",
    title: "A Change in Direction",
    subtitle: "Finding an engineering language",
    body: [
      "Life eventually took me toward Electronics and Communication Engineering. Technology, engineering, and computational systems became a practical language for the questions I already carried.",
      "The direction changed, but the underlying instinct—to understand systems beneath the surface—stayed with me.",
    ],
    quote: "The questions changed shape. The curiosity stayed.",
    status: "Ongoing development",
    visual: "direction",
  },
  {
    id: "the-inward-turn",
    number: "04",
    title: "The Inward Turn",
    subtitle: "Reflection became another form of inquiry",
    body: [
      "A personal relationship ending became one part of a broader period of reflection. It was not an instant transformation, but it invited me to look inward and rethink things.",
      "Around this period, neuroscience, human behavior, and artificial intelligence became stronger interests. I grew more curious about intelligence itself: how minds work, how we behave, and how machines might learn.",
      "Outside technology, I enjoy travelling, exploring unfamiliar places, and finding perspectives that expand how I see the world.",
    ],
    quote: "Understanding the world is one journey. Understanding yourself is another.",
    status: "Past experience",
    visual: "inward",
  },
  {
    id: "learning-through-the-difficult-parts",
    number: "05",
    title: "Learning Through the Difficult Parts",
    subtitle: "Continuing without a polished ending",
    body: [
      "Academics have been challenging, and connecting with people can be difficult too. I can be shy and nervous in social situations—areas I am still learning to navigate.",
      "I do not see these experiences as a completed redemption story. They are part of the work of continuing alongside technical education and ambition.",
    ],
    quote: "Progress isn't always a breakthrough. Sometimes it's choosing to keep going.",
    status: "Ongoing development",
    visual: "resilience",
  },
  {
    id: "from-curiosity-to-creation",
    number: "06",
    title: "From Curiosity to Creation",
    subtitle: "Making ideas practical",
    body: [
      "Right now, much of the journey is about learning and building foundations: software development, digital design, computer architecture, and the tools that turn ideas into working systems.",
      "SIROSIU is part of that practice—an evolving space to experiment, test ideas, and develop stronger technical judgement through real work.",
    ],
    quote: "The goal is to move from understanding ideas to making them work.",
    status: "Current practice",
    visual: "creation",
  },
  {
    id: "where-hardware-meets-intelligence",
    number: "07",
    title: "Where Hardware Meets Intelligence",
    subtitle: "A direction under exploration",
    body: [
      "AI hardware attracts me because it connects two things I care about: the engineering of physical systems and the possibilities of artificial intelligence.",
      "Digital design, computer architecture, software, and intelligent systems are directions I am actively exploring—not claims of finished specialization.",
    ],
    quote: "I want to understand not only what intelligent systems can do, but how they work underneath.",
    status: "Future direction",
    visual: "systems",
  },
  {
    id: "a-life-built-on-my-own-terms",
    number: "08",
    title: "A Life Built on My Own Terms",
    subtitle: "An ambitious, personal horizon",
    body: [
      "The long-term vision is to build useful things, develop real expertise, become financially independent, and earn recognition through genuine contributions under SIROSIU.",
      "It also includes a quieter ambition: eventually living somewhere peaceful, with more freedom to choose how I spend my time. I do not have every answer yet. I am still learning, exploring, and becoming.",
    ],
    quote: "Success, to me, also means having the freedom to live peacefully.",
    status: "Future direction",
    visual: "horizon",
  },
];
