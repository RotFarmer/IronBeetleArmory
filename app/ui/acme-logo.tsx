import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function BeetleLogo() {
  return (
    <div
      className={`${lusitana.className} flex items-center leading-none text-white`}
    >
      <Image
        src="/logo.png"
        alt="iron beetle logo"
        className=" rounded-full"
        width={110}
        height={110}
      />
      <p className="text-nowrap text-[24px]">Iron Beetle Armory</p>
    </div>
  );
}
