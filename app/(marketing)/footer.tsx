import Link from "next/link";
import React from "react";

const footer = [
  {
    title: "Tentang",
    url: "/tentang",
  },
  {
    title: "Kolaborasi",
    url: "/kolaborasi",
  },
  {
    title: "Ketentuan",
    url: "/ketentuan",
  },
  {
    title: "Privasi",
    url: "/privasi",
  },
];

const Footer = () => {
  return (
    <footer className="flex flex-row flex-wrap justify-center items-center gap-2 w-full h-20  p-2 mt-4">
      {footer.map((item, index) => (
        <Link
          href={item.url}
          key={index}
          className="text-primary font-bold text-lg cursor-pointer hover:text-secondary-500 transition-all duration-300 ease-in-out"
        >
          {item.title}
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
