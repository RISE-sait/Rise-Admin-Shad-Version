const Values = {
  API: "https://rise-web-461776259687.us-west2.run.app/",
} as const;

type ValueKey = keyof typeof Values;

export default function getValue(value: ValueKey): string {
  return Values[value];
}