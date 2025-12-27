'use client';

import { useState, useEffect, useRef } from 'react';
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
      <p key={`p-${lineKey++}`} className="text-[#4A4A4A] mb-3 leading-relaxed last:mb-0">
        {processLine(trimmed, idx)}
      </p>
    );
  });

  return elements;
}

export function FAQTile({ faqData }: FAQTileProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highestReached, setHighestReached] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagePopup, setImagePopup] = useState<number | null>(null);
  const currentItemRef = useRef<HTMLButtonElement>(null);

  // Persist progress in localStorage
  useEffect(() => {
    const savedIndex = localStorage.getItem('wyfsb-index');
    const savedHighest = localStorage.getItem('wyfsb-highest');

    if (savedIndex) {
      const idx = parseInt(savedIndex, 10);
      if (!isNaN(idx) && idx >= 0 && idx < faqData.length) {
        setCurrentIndex(idx);
      }
    }
    if (savedHighest) {
      const highest = parseInt(savedHighest, 10);
      if (!isNaN(highest) && highest >= 0) {
        setHighestReached(highest);
      }
    }
  }, [faqData.length]);

  useEffect(() => {
    localStorage.setItem('wyfsb-index', currentIndex.toString());
    // Update highest reached
    if (currentIndex > highestReached) {
      setHighestReached(currentIndex);
      localStorage.setItem('wyfsb-highest', currentIndex.toString());
    }
  }, [currentIndex, highestReached]);

  // Scroll current item into view in sidebar
  useEffect(() => {
    if (currentItemRef.current) {
      currentItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentIndex]);

  // Close popup on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImagePopup(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

  const handleJumpTo = (idx: number) => {
    if (idx === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex(idx);
      setIsTransitioning(false);
      setTimeout(() => setIsRevealed(true), 50);
    }, 200);
  };

  // Determine which questions are visible in the sidebar
  // Show: all completed + current + 4 ahead (revealed progressively)
  const getQuestionVisibility = (idx: number): 'completed' | 'current' | 'upcoming' | 'hidden' => {
    if (idx < currentIndex) return 'completed';
    if (idx === currentIndex) return 'current';
    // Show up to 4 questions ahead, but only if user has progressed enough to "unlock" them
    const revealedUpTo = Math.min(highestReached + 4, faqData.length - 1);
    if (idx <= revealedUpTo && idx <= currentIndex + 4) return 'upcoming';
    return 'hidden';
  };

  return (
    <>
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes faq-reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .faq-reveal-anim {
          animation: faq-reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sidebar-item-reveal {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      {/* Main layout with sidebar */}
      <div className="flex gap-6">
        {/* Main FAQ Content */}
        <div
          className={`flex-1 transition-all duration-500 ${
            isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        >
          {/* THE QUESTION — Terracotta background like demismatch.com */}
          <div
            className={`relative overflow-hidden ${!isRevealed ? 'cursor-pointer group' : ''}`}
            onClick={!isRevealed ? handleReveal : undefined}
            style={{ backgroundColor: '#C75B39' }}
          >
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />

            <div className="relative p-8 md:p-12">
              {/* Question number badge */}
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-12 flex items-center justify-center bg-white/20 text-white font-bold text-lg">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">
                  of {faqData.length}
                </span>
              </div>

              {/* THE HEADLINE — ALL CAPS for bold, brave, direct impact */}
              <h3
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight font-black uppercase tracking-wide"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {currentQ.question}
              </h3>

              {/* Reveal CTA */}
              {!isRevealed && (
                <div className="mt-8 flex items-center gap-4">
                  <span className="text-white/80 text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                    <span className="hidden md:inline">Click</span>
                    <span className="md:hidden">Tap</span>
                    {" "}to reveal
                  </span>
                  <div className="h-px bg-white/30 w-8 group-hover:w-16 transition-all duration-500" />
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* THE ANSWER */}
          {isRevealed && (
            <div className="faq-reveal-anim">
              {/* Answer content — White background */}
              <div className="bg-white">
                <div className="p-8 md:p-12 flex flex-col items-center text-center">
                  {/* Answer text */}
                  <div className="text-lg md:text-xl leading-relaxed space-y-4 max-w-2xl">
                    {parseAnswer(currentQ.answer)}
                  </div>

                  {/* Image Gallery - 2x2 grid */}
                  <div className="mt-10 w-full max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#8B8B8B] mb-4">Related Images</p>
                    <div className="grid grid-cols-2 gap-3">
                      {currentQ.imageUrls.slice(0, 4).map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setImagePopup(idx)}
                          className="group/img relative"
                          title="Click to enlarge"
                        >
                          <div className="relative aspect-square overflow-hidden border border-[#E5E0D8] bg-[#F0EDE6]">
                            <Image
                              src={url}
                              alt={`${currentQ.question} - image ${idx + 1}`}
                              fill
                              className="object-cover group-hover/img:scale-110 transition-transform duration-500"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-[#C75B39]/0 group-hover/img:bg-[#C75B39]/20 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT QUESTION TEASER — Dark section */}
              <div
                className="bg-[#0A0A0A] cursor-pointer group/next"
                onClick={handleNext}
              >
                <div className="p-8 md:p-12 flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#C75B39] mb-3">
                      Up Next
                    </p>
                    <p
                      className="text-lg md:text-xl lg:text-2xl text-white/70 group-hover/next:text-white leading-tight font-bold uppercase tracking-wide transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {nextQ.question}
                    </p>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center bg-[#C75B39] text-white group-hover/next:bg-white group-hover/next:text-[#C75B39] transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BAR */}
          <div className="bg-[#F0EDE6] border-t border-[#E5E0D8]">
            <div className="flex items-center justify-between px-6 py-4">
              {/* Nav controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleRewind}
                  className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                  title="Back to first"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                  title="Previous"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                  title="Next"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
                <div className="flex-1 h-1 bg-[#E5E0D8] relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#C75B39] transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / faqData.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-[#8B8B8B] font-bold tabular-nums">
                  {currentIndex + 1}/{faqData.length}
                </span>
              </div>

              {/* View all link */}
              <a
                href="https://demismatch.com/faq"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest border-2 border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all"
              >
                View All
              </a>
            </div>
          </div>
        </div>

        {/* Question List Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B8B8B] mb-4">
              Questions
            </p>
            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-1">
              {faqData.map((item, idx) => {
                const visibility = getQuestionVisibility(idx);
                if (visibility === 'hidden') return null;

                const isCompleted = visibility === 'completed';
                const isCurrent = visibility === 'current';
                const isUpcoming = visibility === 'upcoming';

                return (
                  <button
                    key={item.id}
                    ref={isCurrent ? currentItemRef : null}
                    onClick={() => handleJumpTo(idx)}
                    className={`
                      sidebar-item-reveal w-full text-left p-3 transition-all duration-300
                      ${isCurrent
                        ? 'bg-[#C75B39] text-white'
                        : isCompleted
                          ? 'bg-white hover:bg-[#F0EDE6] text-[#4A4A4A]'
                          : 'bg-[#F0EDE6]/50 text-[#8B8B8B] hover:bg-[#F0EDE6]'
                      }
                    `}
                    style={{
                      animationDelay: `${(idx - currentIndex) * 50}ms`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`
                        text-xs font-bold tabular-nums flex-shrink-0 w-6
                        ${isCurrent ? 'text-white/80' : 'text-[#C75B39]'}
                      `}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`
                        text-sm leading-tight line-clamp-2
                        ${isUpcoming ? 'opacity-60' : ''}
                      `}>
                        {item.question}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="mt-2 ml-9">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Show count of remaining hidden questions */}
              {(() => {
                const hiddenCount = faqData.filter((_, idx) => getQuestionVisibility(idx) === 'hidden').length;
                if (hiddenCount > 0) {
                  return (
                    <div className="p-3 text-center text-[#8B8B8B] text-sm italic">
                      +{hiddenCount} more questions...
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Image Popup Modal */}
      {imagePopup !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setImagePopup(null)}
        >
          <div
            className="relative max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImagePopup(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Navigation arrows for gallery */}
            {currentQ.imageUrls.length > 1 && (
              <>
                <button
                  onClick={() => setImagePopup(imagePopup > 0 ? imagePopup - 1 : currentQ.imageUrls.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setImagePopup(imagePopup < currentQ.imageUrls.length - 1 ? imagePopup + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            <div className="relative w-full aspect-square bg-[#F0EDE6]">
              <Image
                src={currentQ.imageUrls[imagePopup]}
                alt={`${currentQ.question} - image ${imagePopup + 1}`}
                fill
                className="object-contain"
              />
            </div>
            {/* Image counter */}
            <div className="mt-4 text-center text-white/60 text-sm">
              {imagePopup + 1} of {currentQ.imageUrls.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
