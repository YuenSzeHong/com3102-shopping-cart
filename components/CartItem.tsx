import React from "react";
import { Button } from "react-bootstrap";
import { LineItem } from "../pages/index";
import { Item, getAllItems } from "../pages/core";
import { DecodeError } from "next/dist/shared/lib/utils";

export default function CartItem({
  item,
  decrementItem,
  removeItem,
}: {
  quantity: number;
  item: LineItem;
  removeItem: () => void;
  decrementItem: () => void;
}) {
  const itemInfo = getAllItems().find((itemInfo) => itemInfo.id === item.item);
  return (
    <tr className="align-middle">
      <td className="text-nowrap">{itemInfo?.title}</td>
      <td>{itemInfo?.description}</td>
      <td>${itemInfo?.price}</td>
      <td>{item.quantity}</td>
      <td>
        <Button variant="outline-warning" size="sm" onClick={decrementItem}>
          ➖
        </Button>
      </td>
      <td>${(itemInfo?.price ?? 0) * item.quantity}</td>
      <td>
        <Button variant="danger" onClick={removeItem}>
          🗑️
        </Button>
      </td>
    </tr>
  );
}
