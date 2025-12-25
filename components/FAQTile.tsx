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
      className={`overflow-hidden transition-all duration-300 ${
        isTransitioning ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {/* QUESTION - RED background, WHITE text */}
      <div
        className={`bg-[#DC2626] ${!isRevealed ? 'cursor-pointer' : ''}`}
        onClick={!isRevealed ? handleReveal : undefined}
      >
        <div className="p-10 md:p-14">
          <h3 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight font-playfair">
            {currentQ.question}
          </h3>

          {!isRevealed && (
            <p className="text-white/80 text-lg mt-6">
              Click to reveal →
            </p>
          )}
        </div>
      </div>

      {/* ANSWER - WHITE background, BLACK text */}
      {isRevealed && (
        <div className="animate-fadeIn">
          <div className="bg-white p-10 md:p-14">
            <div className="text-xl md:text-2xl text-black leading-relaxed space-y-4 [&_a]:text-[#DC2626] [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:bg-[#DC2626] [&_a:hover]:text-white [&_a]:transition-all [&_p]:text-black [&_p]:mb-4">
              {parseAnswer(currentQ.answer)}
            </div>

            {/* Single image with red border */}
            <div className="mt-10 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 overflow-hidden border-4 border-[#DC2626]">
                <Image
                  src={currentQ.imageUrl}
                  alt={currentQ.question}
                  width={256}
                  height={256}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* NEXT - BLACK background */}
          <div
            className="bg-black cursor-pointer group p-10 md:p-14"
            onClick={handleNext}
          >
            <p className="text-white/50 text-sm uppercase tracking-widest mb-3">
              Next
            </p>
            <p className="text-2xl md:text-3xl text-white group-hover:text-[#DC2626] transition-colors font-playfair">
              {nextQ.question}
            </p>
          </div>
        </div>
      )}

      {/* NAVIGATION - RED bar */}
      <div className="bg-[#DC2626] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handleRewind}
            className="px-3 py-2 text-white/80 hover:text-white text-lg"
            title="Back to first"
          >
            ««
          </button>
          <button
            onClick={handlePrev}
            className="px-3 py-2 text-white/80 hover:text-white text-lg"
            title="Previous"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-2 text-white/80 hover:text-white text-lg"
            title="Next"
          >
            ›
          </button>
        </div>

        <span className="text-white/80 text-sm">
          {currentIndex + 1} / {faqData.length}
        </span>

        <a
          href="https://demismatch.com/faq"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white text-sm"
        >
          See all →
        </a>
      </div>
    </div>
  );
}
