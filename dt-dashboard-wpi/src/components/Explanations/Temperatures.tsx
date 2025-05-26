import { TemperatureLegendExplanation } from "./TemperaturesLegend";

export const TemperatureExplanations = ({ info }: { info?: boolean }) => {
  return (
    <>
      <h1 className="mb-5 font-bold">Influence des températures</h1>
      <p className="mb-5">
        En changeant modifiant les données d'entrées, vous pourrez observer sur
        la carte les variations de température par département.
      </p>
      <ul className="mb-5">
        <li className="mb-5">
          <TemperatureLegendExplanation />
        </li>
        <li className="text-sm font-bold text-[#1DBDE6]">
          Plus le bleu est intense, plus on s'écarte de la moyenne française
          vers le froid, jusqu'à la minimale.
        </li>
        <li className="text-sm font-bold text-[#F1515E]">
          Plus le rouge est intense, plus on s'écarte de la moyenne française
          vers le chaud, jusqu'à la maximal.
        </li>
      </ul>
      {info ? (
        <>
          <h1 className="mb-5 font-bold italic">
            Information importante sur les températures de l'expérimentation
          </h1>
          <p className="mb-5">
            La sensibilité à participation des agents est relative à la
            température initiale de l'expérimentation en semaine 7 de 2024 dans
            le Puy-de-Döme. La témpérature référence est de{" "}
            <span className="font-bold">12.8°C</span> selon les données météo
            relevées.
          </p>
          <p className="mb-5">
            Plus la température est inférieure à la température de référence
            plus les foyers sont succeptibles de ne pas participer.
          </p>
          <p className="mb-5 italic">
            Vous pouvez influencer sur la sensibilité de la population à la
            température dans les paramètres avancées
          </p>
        </>
      ) : null}
    </>
  );
};
