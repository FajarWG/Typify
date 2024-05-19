import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg flex h-full items-center justify-center gap-4 mx-auto">
        <Image
          src={
            "https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg"
          }
          alt="Indonesia Flag"
          width={50}
          height={50}
        />
        <Image
          src={"https://unikom.ac.id/img/logo_unikom_kuning.png"}
          alt="Indonesia Flag"
          width={50}
          height={50}
        />
        <Image
          src={
            "https://disdikbud.banyuasinkab.go.id/wp-content/uploads/sites/269/2022/11/Logo-Tut-Wuri-Handayani-PNG-Warna.png"
          }
          alt="Indonesia Flag"
          width={50}
          height={50}
        />
      </div>
    </footer>
  );
};

export default Footer;
