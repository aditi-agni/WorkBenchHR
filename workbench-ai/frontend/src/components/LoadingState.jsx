import { useState, useEffect } from "react";

const MSGS = [
  "Searching for best template...",
  "Retrieving from knowledge base...",
  "Populating employee data...",
  "Reviewing document quality...",
  "Almost done...",
];

export default function LoadingState() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MSGS.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="loading">
      <div className="spinner" />
      <p>{MSGS[i]}</p>
    </div>
  );
}
