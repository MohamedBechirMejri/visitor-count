import type { NextApiRequest, NextApiResponse } from "next";
import getImg from "../../libs/getImg";
import {Numbers} from "../../libs/numbers";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const visits = "0001235";

  const getImg = (x: number, data: string) => {
    return `<image x="${x}" y="0" width="45" height="100" xlink:href="${data}"/>`;
  };

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.send(
    `<svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="315"
        height="100"
        version="1.1"
        style="filter: invert(68%) sepia(17%) saturate(1307%) hue-rotate(106deg) brightness(94%) contrast(91%);">
      <title>Visitor Count</title>
      <g>
        ${visits
          .split("")
          .map((d, i) => 
            (d: number, i: number) => getImg(i * 35, Numbers[d])
          )
          .join("")}
      </g>
    </svg>`
  );
}
