// app/test/page.tsx
'use client';
import { useState } from 'react';

export default function TestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function summarize() {
    if (!file) return;
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const b64 = await new Promise<string>((res, rej) => {
        const fr = new FileReader();
        fr.onload = () =>
          fr.result
            ? res((fr.result as string).split(',')[1])
            : rej('Empty file');
        fr.onerror = () => rej('Read error');
        fr.readAsDataURL(file);
      });

      const resp = await fetch('/api/paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64: b64 }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Server error');
      setSummary(data.summary);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">📄 PDF Summarizer Test</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        onClick={summarize}
        disabled={!file || loading}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Summarize PDF'}
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {summary && (
        <pre className="mt-6 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {summary}
        </pre>
      )}
    </div>
  );
}
