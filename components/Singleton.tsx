export default function getValue(Value: string): string | undefined {
  // Values
  const Values: Record<string, string> = {
    API: "https://api-238537761671.us-west2.run.app",
  };

  return Values[Value];
}
