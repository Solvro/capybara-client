import React from "react";

function IntroContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center flex flex-col items-center justify-center w-120">
      {children}
    </div>
  );
}

export default IntroContainer;
