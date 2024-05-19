import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import BeetleLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-10 flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-green-600 p-4 hover:bg-gray-400 md:h-40"
        href="/"
      >
        <div className="w-32 text-white  md:w-40">
          <BeetleLogo />
        </div>
      </Link>
      <div className="h-100 flex grow flex-row justify-stretch space-x-2 md:flex-col md:space-x-0 md:space-y-10">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-400 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
