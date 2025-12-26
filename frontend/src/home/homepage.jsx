
import React, { useState } from 'react'

function makeCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let out = ''
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)]
    return out
}

export default function Homepage() {
    const [url, setUrl] = useState('')
    const [short, setShort] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!url) return
        setLoading(true)
        
        // call backend from here 
        await new Promise((r) => setTimeout(r, 600))
        const code = makeCode(6)
        const shortUrl = `${window.location.origin}/s/${code}`
        setShort(shortUrl)
        setLoading(false)
    }

    const handleCopy = async () => {
        if (!short) return
        try {
            await navigator.clipboard.writeText(short)
            alert('Copied to clipboard')
        } catch (err) {
            alert(short)
            console.error(err)
        }
    }

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
                        {loading ? 'Shortening...' : 'Shorten URL'}
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
    )
}