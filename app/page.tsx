import { FAQTile } from '@/components/FAQTile';
import { FAQItem } from '@/lib/types';

async function getFAQData(): Promise<FAQItem[]> {
  const res = await fetch('https://demismatch.com/api/faq', {
    next: { revalidate: 60 } // Cache for 1 minute, then refresh
  });

  if (!res.ok) {
    throw new Error('Failed to fetch FAQ data');
  }

  return res.json();
}

export default async function Home() {
  const faqData = await getFAQData();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <a
          href="https://demismatch.com"
          className="inline-flex items-center gap-3 group"
        >
          <img
            src="/logo.svg"
            alt=""
            className="w-10 h-10 group-hover:scale-110 transition-transform"
          />
          <span
            className="text-2xl font-bold tracking-[0.1em] text-[#1A1A1A] group-hover:text-[#C75B39] transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            DEMISMATCH
          </span>
        </a>
        <p className="mt-2 text-sm text-[#8B8B8B]">
          Understanding human nature
        </p>
      </header>

      <div className="w-full max-w-5xl">
        <FAQTile faqData={faqData} />
      </div>

      <a
        href="https://demismatch.com"
        className="mt-12 text-sm text-[#8B8B8B] hover:text-[#C75B39] transition-colors"
      >
        Learn more at demismatch.com →
      </a>
    </main>
  );
}
