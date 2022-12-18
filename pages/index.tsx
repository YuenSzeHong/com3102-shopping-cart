import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { getAllItems, Item } from "./core";
import {
  Container,
  Col,
  Row,
  Navbar,
  Table,
  Button,
  Form,
} from "react-bootstrap";
import Head from "next/head";
import ShopItem from "../components/ShopItem";
import CartItem from "../components/CartItem";

export interface LineItem {
  item: string;
  quantity: number;
}

export default function App() {
  const [cart, setCart] = useState<LineItem[]>([]);

  const [search, setSearch] = useState("");

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    setFilteredItems(
      getAllItems().filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    console.debug(
      "current cart",
      cart.map((lineItem) => {
        const item = getAllItems().find(
          (item) => item.id === lineItem.item
        ) as Item;
        return {
          id: lineItem.item,
          item: item?.title,
          description: item?.description,
          price: getAllItems().find((item) => item.id === lineItem.item)?.price,
          quantity: lineItem.quantity,
          subTotal: lineItem.quantity * item?.price,
        };
      })
    );
    console.debug(
      "Total: ",
      `$${cart.reduce((total, lineItem) => {
        const item = getAllItems().find((item) => item.id === lineItem.item);
        if (item) {
          return total + item.price * lineItem.quantity;
        }
        return total;
      }, 0)}`
    );
  }, [cart]);

  function addItemToCart(item: Item) {
    const lineItem = cart.find((lineItem) => lineItem.item === item.id);
    if (lineItem) {
      lineItem.quantity++;
      setCart([...cart]);
    } else {
      setCart([...cart, { item: item.id, quantity: 1 }]);
    }
  }

  function removeItem(item: string) {
    setCart(cart.filter((lineItem) => lineItem.item !== item));
  }

  function incrementItem(index: string) {
    const lineItem = cart.find((lineItem) => lineItem.item === index);
    if (lineItem) {
      lineItem.quantity++;
      setCart([...cart]);
    }
  }

  function decrementItem(index: string) {
    // item quantity > 1 ? quantity - 1 : remove item
    const lineItem = cart.find((lineItem) => lineItem.item === index);
    if (lineItem) {
      if (lineItem.quantity > 1) {
        lineItem.quantity--;
        setCart([...cart]);
      } else {
        setCart(cart.filter((item) => item.item !== index));
      }
    }
  }
  return (
    <>
      <Head>
        <title>Shopping Cart</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛒</text></svg>"
        ></link>
      </Head>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>Shopping Cart</Navbar.Brand>
          <Navbar.Text>{`${cart.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          )} Item in cart, Total $${cart.reduce((total, lineItem) => {
            const item = getAllItems().find(
              (item) => item.id === lineItem.item
            );
            if (item) {
              return total + item.price * lineItem.quantity;
            }
            return total;
          }, 0)}`}</Navbar.Text>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col>
            <h3 className="h3 my-3">Shop🛍️</h3>
            <Form>
              <Form.Group controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
            <div className="d-flex flex-wrap">
              {filteredItems.map((item) => (
                <ShopItem
                  key={item.id}
                  item={item}
                  addItemToCart={addItemToCart}
                />
              ))}
            </div>
          </Col>
          <Col>
            <h3 className="h3 my-3">Cart🛒</h3>
            <Table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th colSpan={3}>Quantity</th>
                  <th className="text-nowrap">Sub-Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.length ? (
                  cart.map((lineItem) => (
                    <CartItem
                      key={lineItem.item}
                      item={lineItem}
                      quantity={lineItem.quantity}
                      decrementItem={() => decrementItem(lineItem.item)}
                      removeItem={() => {
                        removeItem(lineItem.item);
                      }}
                      incrementItem={() => {
                        incrementItem(lineItem.item);
                      }}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>No items in cart</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>
                    <Button
                      className="text-nowrap"
                      onClick={() => {
                        if (cart.length) {
                          alert(
                            `You should pay $${cart.reduce(
                              (total, lineItem) => {
                                const item = getAllItems().find(
                                  (item) => item.id === lineItem.item
                                );
                                if (item) {
                                  return total + item.price * lineItem.quantity;
                                }
                                return total;
                              },
                              0
                            )}. `
                          );
                        }
                      }}
                      variant="outline-success"
                    >
                      Check-Out
                    </Button>
                  </td>
                  <td>Total</td>
                  <td colSpan={2}>
                    {cart.reduce((total, lineItem) => {
                      return total + lineItem.quantity;
                    }, 0)}
                  </td>
                  <td>
                    $
                    {cart.reduce((total, lineItem) => {
                      const item = getAllItems().find(
                        (item) => item.id === lineItem.item
                      );
                      if (item) {
                        return total + item.price * lineItem.quantity;
                      }
                      return total;
                    }, 0)}
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => setCart([])}>
                      🗑️
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}
