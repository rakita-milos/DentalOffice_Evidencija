import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Select } from '../ui/Select';

export function Header({ activePage, onExport }) {
  return (
    <header className="topbar sticky top-0 z-20 px-5 py-4 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-[#DCE7F3] bg-white text-[#0D47A1] lg:hidden">
            <span className="text-2xl leading-none">≡</span>
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#0D2B5C]">{activePage}</h1>
            <p className="text-sm font-medium text-[#6B7280]">Stomatološka ordinacija dr Rosa Bašić</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value="Maj 2025" onChange={() => {}} className="w-40">
            <option>Maj 2025</option>
            <option>April 2025</option>
            <option>Mart 2025</option>
          </Select>
          <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#DCE7F3] bg-white text-[#0D47A1]">
            <Icon name="bell" size={20} />
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#1E88E5] text-[11px] font-black text-white">3</span>
          </button>
          <Button onClick={onExport} variant="primary"><Icon name="download" size={17} /> Export</Button>
        </div>
      </div>
    </header>
  );
}
