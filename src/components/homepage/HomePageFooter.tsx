import React from "react";

interface HomePageFooterProps {
  currentYear?: number;
}

export default function HomePageFooter({
  currentYear = new Date().getFullYear(),
}: HomePageFooterProps) {
  return (
    <footer className="text-center py-6 border-t mt-10 text-sm bg-white px-4">
      <p>
        © {currentYear} | Developed by{" "}
        <a
          href="https://prithvijitbasak.netlify.app/"
          className="text-[#4caf50] font-medium hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Prithvijit Basak
        </a>
      </p>
    </footer>
  );
}
