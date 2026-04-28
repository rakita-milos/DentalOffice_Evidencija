import { Sidebar } from './Sidebar';
import { Header } from './Header';
export function PageLayout({ activePage,setActivePage,onExport,children }){return <div className="min-h-screen bg-slate-50 text-slate-950"><Sidebar activePage={activePage} setActivePage={setActivePage}/><main className="lg:pl-72"><Header activePage={activePage} onExport={onExport}/><section className="p-5 lg:p-8">{children}</section></main></div>;}
