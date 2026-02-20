import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-rose-700">Zara&apos;s Crunch</h3>
          <p className="text-sm text-stone-600">Fresh small chops, shawarma, cakes, and drinks in Kaduna.</p>
          <p className="text-sm text-stone-500">Kaduna, opposite NTI.</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li><Link href="/menu" className="hover:text-rose-700">Menu</Link></li>
            <li><Link href="/about" className="hover:text-rose-700">About Owner</Link></li>
            <li><Link href="/cart" className="hover:text-rose-700">Cart</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li><a href="tel:+2348144617310" className="hover:text-rose-700">+234 814 461 7310</a></li>
            <li><a href="mailto:orders@zarascrunch.com" className="hover:text-rose-700">orders@zarascrunch.com</a></li>
            <li><a href="https://wa.me/2348144617310" target="_blank" rel="noreferrer" className="hover:text-rose-700">WhatsApp Order</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
