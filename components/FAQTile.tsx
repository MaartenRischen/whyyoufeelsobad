'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FAQItem } from '@/lib/types';

interface FAQTileProps {
  faqData: FAQItem[];
}

// Parse markdown-style links for display
function parseAnswer(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let lineKey = 0;

  const processLine = (line: string, key: number): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let partKey = 0;

    let processedLine = line;
    processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '###BOLD_START###$1###BOLD_END###');
    processedLine = processedLine.replace(/\*([^*]+)\*/g, '###ITALIC_START###$1###ITALIC_END###');

    while ((match = linkRegex.exec(processedLine)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = processedLine.substring(lastIndex, match.index);
        parts.push(...renderFormattedText(beforeText, `before-${key}-${partKey++}`));
      }

      const linkText = match[1];
      const href = match[2];

      // For glossary links, make them point to demismatch.com
      const fullHref = href.startsWith('/')
        ? `https://demismatch.com${href}`
        : href;

      parts.push(
        <a
          key={`link-${key}-${partKey++}`}
          href={fullHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C75B39] hover:underline font-medium"
        >
          {linkText}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < processedLine.length) {
      const remaining = processedLine.substring(lastIndex);
      parts.push(...renderFormattedText(remaining, `after-${key}-${partKey}`));
    }

    return parts.length > 0 ? parts : processedLine;
  };

  const renderFormattedText = (text: string, keyPrefix: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    const parts = text.split(/(###BOLD_START###|###BOLD_END###|###ITALIC_START###|###ITALIC_END###)/);
    let inBold = false;
    let inItalic = false;
    let partIdx = 0;

    for (const part of parts) {
      if (part === '###BOLD_START###') {
        inBold = true;
      } else if (part === '###BOLD_END###') {
        inBold = false;
      } else if (part === '###ITALIC_START###') {
        inItalic = true;
      } else if (part === '###ITALIC_END###') {
        inItalic = false;
      } else if (part) {
        if (inBold) {
          result.push(<strong key={`${keyPrefix}-${partIdx++}`}>{part}</strong>);
        } else if (inItalic) {
          result.push(<em key={`${keyPrefix}-${partIdx++}`}>{part}</em>);
        } else {
          result.push(part);
        }
      }
    }

    return result;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed === '') return;

    elements.push(
      <p key={`p-${lineKey++}`} className="text-gray-300 mb-3 leading-relaxed last:mb-0">
        {processLine(trimmed, idx)}
      </p>
    );
  });

  return elements;
}

export function FAQTile({ faqData }: FAQTileProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Persist progress in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wyfsb-index');
    if (saved) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < faqData.length) {
        setCurrentIndex(idx);
      }
    }
  }, [faqData.length]);

  useEffect(() => {
    localStorage.setItem('wyfsb-index', currentIndex.toString());
  }, [currentIndex]);

  const currentQ = faqData[currentIndex];
  const nextQ = faqData[(currentIndex + 1) % faqData.length];

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex((prev) => (prev + 1) % faqData.length);
      setIsTransitioning(false);
      setTimeout(() => setIsRevealed(true), 50);
    }, 200);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex((prev) => (prev - 1 + faqData.length) % faqData.length);
      setIsTransitioning(false);
      setTimeout(() => setIsRevealed(true), 50);
    }, 200);
  };

  const handleRewind = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex(0);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <div
      className={`bg-[#1a1a1a] rounded-2xl border border-gray-800 shadow-xl overflow-hidden transition-all duration-300 ${
        isTransitioning ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {/* Question */}
      <div
        className={`p-8 ${!isRevealed ? 'cursor-pointer hover:bg-[#222]' : ''} transition-colors`}
        onClick={!isRevealed ? handleReveal : undefined}
      >
        <h3
          className="text-2xl md:text-3xl text-[#faf9f6] leading-snug font-playfair"
        >
          {currentQ.question}
        </h3>

        {!isRevealed && (
          <p className="text-gray-500 text-sm mt-4">Click to reveal answer</p>
        )}
      </div>

      {/* Answer (when revealed) */}
      {isRevealed && (
        <div className="animate-fadeIn">
          {/* Answer content */}
          <div className="px-8 pt-6 pb-4">
            {parseAnswer(currentQ.answer)}
          </div>

          {/* Image */}
          <div className="px-8 pb-6 flex justify-center">
            <div className="w-48 h-48 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
              <Image
                src={currentQ.imageUrl}
                alt={currentQ.question}
                width={192}
                height={192}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mx-8" />

          {/* Next Question Teaser */}
          <div
            className="p-8 cursor-pointer hover:bg-[#222] transition-colors group"
            onClick={handleNext}
          >
            <p className="text-sm text-gray-500 mb-2">Next question:</p>
            <p
              className="text-lg text-gray-400 group-hover:text-[#faf9f6] italic transition-colors font-playfair"
            >
              {nextQ.question}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="px-8 py-4 bg-[#111] border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleRewind}
              className="px-2 py-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors text-sm font-mono"
              title="Back to first question"
            >
              &lt;&lt;
            </button>
            <button
              onClick={handlePrev}
              className="px-2 py-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors text-sm font-mono"
              title="Previous question"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="px-2 py-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors text-sm font-mono"
              title="Next question"
            >
              &gt;
            </button>
          </div>
          <span className="text-gray-600 text-sm font-mono">
            {currentIndex + 1} / {faqData.length}
          </span>
        </div>
      </div>
    </div>
  );
}
