const Values = {
<<<<<<< HEAD:components/Singleton.tsx
  API: "https://rise-web-461776259687.us-west2.run.app/",
=======
  API: process.env.NODE_ENV === "production"  ? "https://api-461776259687.us-west2.run.app/" : "http://localhost/",
>>>>>>> 2ef6cfaa23d9da29982d2f88a300c108b4fcee7b:configs/constants.ts
} as const;

type ValueKey = keyof typeof Values;

export default function getValue(value: ValueKey): string {
  return Values[value];
}