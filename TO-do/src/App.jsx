import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function App() {
  const [fact, setFact] = useState("Click the button to get a cat fact!");
  const [load, setLoad] = useState(0);

  const { user } = useUser();

  const handleSubmit = () => {
    setLoad((prev) => prev + 1);
  };
  const speakFact = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (load === 0) return;

    axios
      .get("https://catfact.ninja/fact")
      .then((res) => {
        setFact(res.data.fact);
        speakFact(res.data.fact);
      })
      .catch(() => setFact("Failed to fetch cat fact. Try again!"));
  }, [load]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-900 to-purple-900 px-4 py-6">
      <header className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-white text-3xl font-bold">🐱 Cat Fact App</h1>

        <SignedOut>
          <SignInButton>
            <button className="bg-white text-blue-800 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <SignedIn>
        <p className="text-white text-xl mb-4">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}! 🎉
        </p>
      </SignedIn>

      <SignedOut>
        <p className="text-white text-lg mt-16">
          Please sign in to generate cat facts. 🐾
        </p>
      </SignedOut>

      <SignedIn>
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-red-900 font-semibold px-6 py-3 border-4 border-red-600 rounded-xl transition duration-300 ease-in-out shadow-lg"
          onClick={handleSubmit}
        >
          Generate Cat Fact
        </button>
        <button
          className="mt-4 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow"
          onClick={() => speakFact(fact)}
        >
          🔊 Speak Again
        </button>

        <p className="text-white mt-8 text-lg max-w-2xl text-center leading-relaxed">
          {fact}
        </p>
      </SignedIn>
    </div>
  );
}

export default App;
