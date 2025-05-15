import React from "react";

const Loader = () => {
  return (
    <div className="flex h-[400px] items-center justify-center">
      <div className="animate-spin border-2 border-primary border-t-transparent rounded-full h-12 w-12"></div>
    </div>
  );
};

export default Loader;
