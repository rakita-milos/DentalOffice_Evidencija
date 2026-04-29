import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function PageLayout({ activePage, setActivePage, onExport, children }) {
  return (
    <div className="app-shell text-[#1F2937]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="lg:pl-[292px]">
        <Header activePage={activePage} onExport={onExport} />
        <section className="p-5 lg:p-8">
          {children}
        </section>
        <footer className="pb-6 text-center text-xs text-[#6B7280]">© 2025 Stomatološka ordinacija dr Rosa Bašić. Sva prava zadržana.</footer>
      </main>
    </div>
  );
}
