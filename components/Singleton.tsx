export default function getValue(Value: string): string | undefined {
  // Values
  const Values: Record<string, string> = {
    API: "https://api-461776259687.us-west2.run.app",
  };

  return Values[Value];
}
