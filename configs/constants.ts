const Values = {
  API: process.env.NODE_ENV === "production"  ? "https://api-461776259687.us-west2.run.app/" : "http://localhost",
} as const;

type ValueKey = keyof typeof Values;

export default function getValue(value: ValueKey): string {
  return Values[value];
}