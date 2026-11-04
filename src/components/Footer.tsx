import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper bg-[#4caf50] mt-auto">
      <div className="container">
        <div className="px-4 py-5">
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-white text-center">
            <span className="text-xl font-bold">PB Expense Tracker</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-base">
              Developed by{" "}
              <a
                href="https://prithvijitbasak.netlify.app/"
                className="underline underline-offset-2 hover:opacity-90"
                target="_blank"
                rel="noreferrer"
              >
                Prithvijit Basak
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
