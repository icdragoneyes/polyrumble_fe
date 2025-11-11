/**
 * x402 JSON API Discovery Page
 * Returns pure JSON specification for AI agent discovery
 */

import { useEffect, useState } from 'react';
import { fetchX402Spec, type X402Specification } from '../services/x402Spec';

export default function X402JsonPage() {
  const [spec, setSpec] = useState<X402Specification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update page metadata for SEO
    document.title = 'x402 API Specification - PolyRumble Polymarket AI Agent Integration';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'x402 protocol API specification for PolyRumble. Integrate AI agents with Polymarket trader comparison and betting platform. Pay-per-use API with Solana and x402 payment protocol.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'x402, polymarket API, x402 protocol, AI agent API, polymarket integration, autonomous betting, pay-per-use API, solana API, prediction market API, x402 specification');
    }

    loadSpec();
  }, []);

  const loadSpec = async () => {
    try {
      const data = await fetchX402Spec();
      setSpec(data);
    } catch (error) {
      console.error('Failed to load x402 spec:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-green-400 flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4">Loading x402 specification...</p>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center font-mono">
        <div className="text-center">
          <p className="text-xl">Error: Failed to load x402 specification</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono">
      <pre className="overflow-x-auto text-sm whitespace-pre-wrap break-words">
        {JSON.stringify(spec, null, 2)}
      </pre>
    </div>
  );
}
