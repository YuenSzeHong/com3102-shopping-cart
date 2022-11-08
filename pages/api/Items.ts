// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Item, getAllItems } from "../core";

type query = {
  id: string;
  title: string;
  priceMax: number;
  priceMin: number;
  sort: string;
};

type Data = {
  query: query;
  message: string;
  data: Item[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let result = [...getAllItems()];
  if (req.query.id) {
    result = result.filter((item) => item.id === req.query.id);
  } else {
    // title and price range query
    if (req.query.title) {
      result = result.filter((item) =>
        item.title
          .toLowerCase()
          .includes((req.query.title as string).toLowerCase())
      );
    }
    if (req.query.priceRange) {
      const [min, max] = (req.query.priceRange as string).split("-");
      result = result.filter(
        (item) => item.price >= +min && item.price <= +max
      );
    }

    switch (req.query.sort) {
      case "cheapest":
        result.sort((a, b) => a.price - b.price);
        break;
      case "most expensive":
        result.sort((a, b) => b.price - a.price);
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title reverse":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    res.status(200).json({
      query: {
        id: req.query.id,
        title: req.query.title,
        priceMax: req.query.priceRange
          ? parseInt((req.query.priceRange as string).split("-")[1])
          : undefined,
        priceMin: req.query.priceRange
          ? parseInt((req.query.priceRange as string).split("-")[0])
          : undefined,
        sort: req.query.sort ?? "default",
      },
      message: result.length
        ? `Found ${result.length} results`
        : `No results found with the given query`,
      data: result,
    } as Data);
  }
}
