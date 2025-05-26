export const TemperatureLegendExplanation = () => {
  return (
    <>
      <h1 className="mb-5 font-bold">Légende des températures</h1>
      <div className="mb-1 h-[20px] rounded bg-gradient-to-r from-[#1DBDE6] to-[#F1515E]"></div>
      <div className="flex justify-between">
        <div className="text-sm font-bold text-[#1DBDE6]">
          Temperature minimal
        </div>
        <div className="text-sm font-bold text-[#8787A2] ">
          Temperature moyenne
        </div>
        <div className="text-sm font-bold text-[#F1515E]">
          Temperature maximal
        </div>
      </div>
    </>
  );
};
