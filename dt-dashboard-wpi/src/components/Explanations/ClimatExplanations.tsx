import Image from "next/image";
import h3Legend from "../../../public/images/country/h3-legend.png";
import h3Black from "../../../public/images/country/h3-black.png";
import { ClimatLegendExplanations } from "./ClimatLegendExplanations";

export const ClimatExplanations = ({ info }: { info?: boolean }) => {
  return (
    <>
      <h1 className="mb-5 font-bold">Influence du climat</h1>
      <p className="mb-5">
        La similarité climatique avec la region de l'expérimentation (cf:
        Puy-de-Dôme - H1c) est employée pour différencier les comportements des
        agents
      </p>
      <p className="mb-5 flex justify-center">
        <Image src={h3Legend} width="300" alt="h3-legend" />
        <Image src={h3Black} width="300" alt="h3-black" />
      </p>
      <ul className="mb-5">
        <li className="mb-5">
          <ClimatLegendExplanations />
        </li>
        <li className="text-sm font-bold">
          Plus la région climatique est foncé (région froide), plus la
          population aura tendance à ne pas vouloir participer
        </li>
        <li className="text-sm font-bold">
          Plus la région climatique est claire (région chaude), plus la
          population aura tendance vouloir participer
        </li>
      </ul>
      <p className="mb-5">
        L'indicateur de rigueur climatique est représenté à partir des zones
        climatiques H1, H2, H3 decliné en 8 sous zone.
        <ul className="my-3 pl-3">
          <li>• H1, la zone la plus froide au Nord-Est</li>
          <li>• H2, une zone tempérée à l'Ouest et au Sud-Ouest</li>
          <li>• H3, la zone la plus chaude au Sud-Est de la France</li>
        </ul>
      </p>
      <p className="mb-5">
        Comme les trois zones H, H2, H3, sont très étendues, des variations de
        climat y sont observées. Ces zones climatiques sont sous-divisées en
        zone thermique par région, de la plus chaude à la plus froide. Pour les
        distinguer, la lettre "a" correspondant à la plus froide et "d" à la
        plus chaude est utilisée
        <ul className="my-3 pl-3">
          <li>• H1 est divisée en H1a, H1b, H1c </li>
          <li>• H2 est découpée en H2a, H2b, H2c, H2d</li>
          <li>• H3 sans sous-divisions</li>
        </ul>
      </p>
      {info ? (
        <>
          <h1 className="mb-5 font-bold italic">
            Information importante sur le climat de l'expérimentation
          </h1>
          <p>
            La région climatique de base H1c (voir carte: Puy-de-Dôme). Les
            départements dans la même région climatique se comporteront
            statistiquement de la même manière
          </p>
          <p>
            <ul className="my-3 pl-3">
              <li>
                • H1a, H1b: tendance à vouloir moins participer (plus froid){" "}
              </li>
              <li>• H1c: même tendance que pour le Puy-de-Dôme</li>
              <li>• H2, H3: tandance à plus participer (plus chaud)</li>
            </ul>
          </p>
          <p className="mb-5 italic">
            Vous pouvez influencer sur la sensibilité de la population au climat
            dans les paramètres avancées
          </p>
        </>
      ) : null}
    </>
  );
};
