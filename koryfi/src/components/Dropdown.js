import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Dropdown.css";
import { useBannerContext } from "../contexts/BannerProvider.js";

export default function Dropdown({ toggleIsOpen, type, parentRef }) {
  const { cart, removeItem, updateCount } = useCart();
  const { logout, currentUser } = useAuth();
  const [total, setTotal] = useState(0);
  const { setVisible, setMessage } = useBannerContext();

  const navigate = useNavigate();

  useEffect(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.price * item.count;
    });
    setTotal(totalPrice);
  }, [cart]);

  async function handleLogout() {
    await logout()
      .then((auth) => {
        setMessage("Success");
        setVisible(true);
      })
      .catch((e) => {
        setMessage(e.message);
        setVisible(true);
      });
    navigate("/");
  }

  return (
    <>
      {type === "cart" ? (
        <div className="dropdownContainer">
          {cart.length > 0 ? (
            <div className="cart">
              {cart !== undefined &&
                cart.map((item, index) => {
                  return (
                    <li className="cartItem">
                      {item.images && (
                        <img
                          className="cartItemImg"
                          src={
                            !item.category.includes("clothing")
                              ? item.images[0].lowRes
                              : item.images[0].images[0].lowRes
                          }
                          alt=""
                        />
                      )}

                      <div className="nameAndButton">
                        <div className="nameAndPrice">
                          <div className="name">
                            <h5 className="cartItemName">{item.name}</h5>
                            {item.count && (
                              <div className="count">
                                <h5 className="countAmount">x{item.count}</h5>
                              </div>
                            )}
                          </div>

                          <h4 className="cartItemPrice">{item.price}</h4>
                        </div>
                        <div className="countUpdate">
                          <span
                            className="minus"
                            onClick={() => updateCount(index, -1)}
                          >
                            -
                          </span>
                          <span
                            className="plus"
                            onClick={() => updateCount(index, 1)}
                          >
                            +
                          </span>
                        </div>
                        <div
                          className="remove"
                          onClick={() => {
                            removeItem(index);
                          }}
                        >
                          X
                        </div>
                      </div>
                    </li>
                  );
                })}
              <div className="footer">
                <div className="total">{total > 0 && total}</div>
                <Link to="/checkout">
                  <button
                    className="checkOutButton"
                    onClick={() => {
                      toggleIsOpen(false);
                    }}
                  >
                    Check Out
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h3>Add Some Items!</h3>
              <Link
                to="/products"
                onClick={() => {
                  toggleIsOpen(false);
                }}
              >
                <button>Browse our Catalog</button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="dropdownContainer">
          <div className="header">
            <h4>{`Hey ${currentUser.firstName}!`}</h4>
          </div>
          <div className="content">
            <Link
              to="/account"
              onClick={() => {
                toggleIsOpen(false);
              }}
              className="accountSettings"
            >
              View Your Account Settings
            </Link>
          </div>
          <div>
            <button className="button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
