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
      <div className="w-full max-w-2xl">
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
