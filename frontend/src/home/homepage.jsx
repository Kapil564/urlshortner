import axios from "axios";
import React, { useState } from "react";
import { getAnonId } from "./../utils/anonUser.js";
import { getRecentLinks, saveRecentLink } from "./../utils/recentLinks.js";
export default function Homepage() {
  const backendUrl = "http://localhost:3000";
  const [url, setUrl] = useState("");
  const [short, setShort] = useState("");
  const [loading, setLoading] = useState(false);
  const links = getRecentLinks();

    React.useEffect(() => {
        getAnonId();
    }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!url) return;

  setLoading(true);

  try {
    const anonId = getAnonId();

    const res = await axios.post(
      `${backendUrl}/shorten`,
      { originalUrl: url },
      {
        headers: {
          "X-Anon-Id": anonId, // future-ready
        },
      }
    );

    const { code } = res.data;
    const shortUrl = `${backendUrl}/${code}`;

    setShort(shortUrl);
    saveRecentLink(url, code);

  } catch (err) {
    console.error(err);
    alert("Failed to shorten URL");
  } finally {
    setLoading(false);
  }
};


  const handleCopy = async () => {
    if (!short) return;
    try {
      await navigator.clipboard.writeText(short);
      alert("Copied to clipboard");
    } catch (err) {
      alert(short);
      console.error(err);
    }
  };

  return (
    <main className="hero" id="home">
      <div className="container">
        <h1 className="hero-title">Shorten URLs quickly — share anywhere</h1>
        <p className="hero-sub">Create compact, memorable links in seconds.</p>

        <form className="short-form" onSubmit={handleSubmit}>
          <input
            placeholder="Paste a long URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-url"
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {short && (
          <div className="result">
            <a href={short} target="_blank" rel="noreferrer">
              {short}
            </a>
            <button className="btn small" onClick={handleCopy}>
              Copy
            </button>
          </div>
        )}
        <div className="Recent">
          <h2>Recent Shortened Links</h2>
          {links.map((link, index) => (
            <div key={index} className="recent-item">
              <a
                href={`${backendUrl}/${link.shortCode}`}
                target="_blank"
                rel="noreferrer"
              >
                {backendUrl}/{link.shortCode}
              </a>
            </div>
          ))}
        </div>
        <section className="features" id="features">
          <h2>Why use JSUrlShortner?</h2>
          <ul>
            <li>Fast, simple shortening UI</li>
            <li>Share short links anywhere</li>
            <li>Track clicks and manage links (coming soon)</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
