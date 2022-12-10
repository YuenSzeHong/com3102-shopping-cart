// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Item, getAllItems, addItem } from "../core";

type query = {
  id?: string;
  title?: string;
  priceMax?: number;
  priceMin?: number;
  sort?: string;
};

type Data = {
  query?: query;
  message: string;
  data: Item[];
};

type Response = {
  status?: number;
  data?: Data;
  message?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {

  switch (req.method) {
    case "GET":
      getItems();
      break;
    case "POST":
      createItem()
      break;
    default:
      res.status(405).json({ message: "Method not allowed", status: 405 });
      return;
  }

  function createItem() {
    const { title, price, description } = req.body;
    if (!title || !price || !description) {
      res.status(400).json({ message: "Missing data", status: 400 });
      return;
    }

    const item: Item = {
      id: (getAllItems().length + 1).toString(),
      title,
      price,
      description,
    };

    addItem(item.id, item.title, item.description, item.price);



    res.status(201).json({
      status: 201,
      data: {
        message: "Item created",
        data: [item],
      },
    });
  }

  function getItems() {
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
        status: 200,
        data: {
          query: {
            id: req.query.id,
            title: req.query.title as string,
            priceMax: req.query.priceRange
              ? parseInt((req.query.priceRange as string).split("-")[1])
              : undefined,
            priceMin: req.query.priceRange
              ? parseInt((req.query.priceRange as string).split("-")[0])
              : undefined,
            sort: req.query.sort as string ?? "default",
          },
          message: result.length
            ? `Found ${result.length} results`
            : `No results found with the given query`,
          data: result,
        }
      });
    };
  }
}


