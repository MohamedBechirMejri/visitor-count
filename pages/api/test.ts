import type { NextApiRequest, NextApiResponse } from "next";
import {
  zero,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
} from "../../libs/numbers";

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
          .map((d, i) => {
            const number =
              d === "1"
                ? one
                : d === "2"
                ? two
                : d === "3"
                ? three
                : d === "4"
                ? four
                : d === "5"
                ? five
                : d === "6"
                ? six
                : d === "7"
                ? seven
                : d === "8"
                ? eight
                : d === "9"
                ? nine
                : zero;

            return getImg(i * 35, number);
          })
          .join("")}
      </g>
    </svg>`
  );
}
