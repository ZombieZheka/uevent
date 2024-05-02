import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import {clearPaymentSession} from "../../app/paymentSlice";


export const Home1 = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearPaymentSession());
  }, [dispatch]);

  return (
    <div className="main-container">
      <div className="info">
        <h1>Payment</h1>
      </div>
      <ul className="integration-list">
        <li className="integration-list-item">
          <Link to="/preview/dropin" className="integration-list-item-link">
            <div className="title-container">
              <p className="integration-list-item-title">pay</p>
            </div>
          </Link>
        </li>
      </ul>
      <div className="mt-5">
        <Link to="/cancel" className="button text-light">
          Cancel and Refund a payment
        </Link>
      </div>
    </div>
  )
}
