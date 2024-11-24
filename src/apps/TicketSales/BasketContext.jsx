import { createContext, useContext, useState } from "react";

const BasketContext = createContext();

export const useBasket = () => useContext(BasketContext);

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  const addToBasket = (ticketType, quantity, price, eventName) => {
    setBasket((prevBasket) => {
      // check if identical ticket type with identical price is already in the basket
      const existingItem = prevBasket.find(
        (item) =>
          item.id === ticketType.id &&
          item.eventId === ticketType.eventId &&
          item.price === price
      );
      // if above, add that ticket type by quantity
      if (existingItem) {
        return prevBasket.map((item) =>
          item.id === ticketType.id &&
          item.eventId === ticketType.eventId &&
          item.price === price
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        // else, add new ticket type item to basket
      } else {
        return [
          ...prevBasket,
          {
            ...ticketType,
            quantity: quantity,
            price: price,
            eventName: eventName,
          },
        ];
      }
    });
  };

  //TODO: Add way to remove item from basket
  const removeFromBasket = (data) => {
    setBasket((prevBasket) => prevBasket.filter((item) => item !== data));
  };

  const plusOneTicket = (data) => {
    setBasket((prevBasket) =>
      prevBasket.map((item) =>
        item === data ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const minusOneTicket = (data) => {
    // Disable removing the last ticket
    if (data.quantity == 1) {
      return;
    }
    setBasket((prevBasket) =>
      prevBasket.map((item) =>
        item === data ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  return (
    <BasketContext.Provider
      value={{
        basket,
        setBasket,
        addToBasket,
        removeFromBasket,
        plusOneTicket,
        minusOneTicket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};
