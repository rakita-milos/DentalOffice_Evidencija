import { navItems } from '../../constants/routes';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

export function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar fixed left-0 top-0 hidden h-full w-[292px] p-5 lg:block">
      <div className="mb-8 flex justify-center border-b border-[#E5EDF7] pb-6">
        <img src="/brand/dr-rosa-basic-logo.png" alt="Stomatološka ordinacija dr Rosa Bašić" className="sidebar-logo" />
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = activePage === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`nav-item flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-[15px] font-bold transition ${active ? 'nav-item-active' : 'hover:bg-[#F5F7FA]'}`}
            >
              <Icon name={item.icon} size={21} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-5 right-5 space-y-4">
        <div className="soft-card flex items-center gap-3 p-4">
          <div className="h-11 w-11 overflow-hidden rounded-full bg-[#E3F2FD]">
            <div className="grid h-full w-full place-items-center text-sm font-black text-[#1E88E5]">A</div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-[#0D2B5C]">Admin</p>
            <p className="text-xs text-[#6B7280]">Administrator</p>
          </div>
          <Icon name="arrow" size={16} className="text-[#0D47A1]" />
        </div>
        <Button variant="light" className="w-full justify-start">
          <Icon name="logout" size={18} /> Odjavi se
        </Button>
      </div>
    </aside>
  );
}
