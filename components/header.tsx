import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 left-0 z-10 w-full h-20 leading-20 flex items-center justify-between px-8 bg-white">
      <Link className="text-3xl" href="/">
        {process.env.NEXT_PUBLIC_TITLE}{" "}
        <span className="text-sm hidden md:inline-block ml-2">
          {process.env.NEXT_PUBLIC_SUB_TITLE}
        </span>
        <p className="md:hidden text-sm mt-1">
          {process.env.NEXT_PUBLIC_SUB_TITLE}
        </p>
      </Link>

      <ul className="flex gap-4">
        {/* <Link className="font-bold" href="/about">
          Github
        </Link>
        <Link className="font-bold" href="/about">
          掘金
        </Link> */}
        <Link className="font-bold" href="/about">
          About
        </Link>
      </ul>
    </header>
  );
};

export default Header;
