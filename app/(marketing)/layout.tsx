import { BackgroundBeams } from "@/components/molecules/background";
import Footer from "./footer";
import Header from "./header";

type Props = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full rounded-md bg-white relative flex flex-col items-center justify-center antialiased">
      {/* <Header /> */}
      <main className="flex-1 flex flex-col item-center justify-center z-10">
        {children}
      </main>

      <Footer />
      <BackgroundBeams />
    </div>
  );
};

export default MarketingLayout;
