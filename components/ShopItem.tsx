import React from "react";
import { Item } from "../pages/core";
import { Button, Card } from "react-bootstrap";

export default function ShopItem({
  item,
  addItemToCart,
}: {
  item: Item;
  addItemToCart: (item: Item) => void;
}) {
  return (
    <Card style={{ width: "200px" }} className="m-2 d-flex-wrap">
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <Card.Text className="align-top">{item.description}</Card.Text>
        <Card.Text color="disabled">${item.price}</Card.Text>
        <Button variant="primary" onClick={() => addItemToCart(item)}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}
