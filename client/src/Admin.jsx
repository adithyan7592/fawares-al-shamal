import { useEffect, useState } from "react";

export default function Admin() {
  const [key, setKey] = useState(sessionStorage.getItem("fas-admin") || "");
  const [input, setInput] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("fas-admin");
    if (saved) load(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(password) {
    setError("");
    const res = await fetch("/api/quotes", { headers: { "x-admin-key": password } });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unauthorized");
      setLoaded(false);
      return;
    }
    sessionStorage.setItem("fas-admin", password);
    setKey(password);
    setQuotes(data.quotes || []);
    setLoaded(true);
  }

  if (!loaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50 px-4">
        <form
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg ring-1 ring-stone-200"
          onSubmit={(e) => {
            e.preventDefault();
            load(input || key);
          }}
        >
          <h1 className="font-display text-2xl text-forest-800">Quote inbox</h1>
          <p className="mt-1 text-sm text-stone-500">Enter the admin password to view submitted quote requests.</p>
          <input
            type="password"
            className="mt-4 w-full rounded-md border border-stone-200 px-3 py-2"
            placeholder="Admin password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
          <button type="submit" className="mt-4 w-full rounded-md bg-forest-800 py-2.5 text-sm font-semibold text-white">
            Open inbox
          </button>
          <a href="/" className="mt-4 block text-center text-sm text-forest-700">
            Back to site
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl text-forest-800">Quote inbox</h1>
          <a href="/" className="text-sm font-semibold text-forest-700">
            Back to site
          </a>
        </div>
        {quotes.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-stone-500 shadow-sm">No quote requests yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-forest-800 text-white">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q._id} className="border-t border-stone-100 align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-stone-500">
                      {new Date(q.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold">{q.name}</td>
                    <td className="px-4 py-3">{q.number}</td>
                    <td className="px-4 py-3">{q.location}</td>
                    <td className="px-4 py-3 text-stone-600">{q.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
