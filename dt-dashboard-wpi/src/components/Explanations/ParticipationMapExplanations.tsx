export const ParticipationMapExplanations = ({
  clientKind,
}: {
  clientKind: string;
}) => {
  return (
    <>
      <h1 className="mb-5 font-bold">
        Dispersion spaciale de la population des "{clientKind}"
      </h1>
      {clientKind === "Participants passifs" ? (
        <>
          <div
            className={`mb-1 h-[20px] rounded bg-gradient-to-r from-white to-[#1423dc]`}
          ></div>
        </>
      ) : clientKind === "Participants actifs" ? (
        <>
          <div
            className={`mb-1 h-[20px] rounded bg-gradient-to-r from-white to-[#93c90e]`}
          ></div>
        </>
      ) : clientKind === "Non participants" ? (
        <>
          <div
            className={`mb-1 h-[20px] rounded bg-gradient-to-r from-white to-[#fb5454]`}
          ></div>
        </>
      ) : null}
      <div className="flex justify-between">
        <div className="text-sm font-bold">Basse densité</div>
        <div className="text-sm font-bold">Moyenne densité</div>
        <div className="text-sm font-bold">Haute densité</div>
      </div>

      <p className="mt-3">
        La densité des catégories de participation est sensiblement liée à la
        densité de population des différentes zone de France.
        <br />
        <i>
          Exemple: Paris étant très peuplé par rapport au reste de la France, on
          observe une forte densité de participants ou non participants
        </i>
      </p>
    </>
  );
};
