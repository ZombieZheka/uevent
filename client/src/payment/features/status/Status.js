import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { paymentSession } from "../../app/paymentSlice";
import {useSelector} from "react-redux";

export const StatusContainer = () => {
  let { type } = useParams();
  let query = new URLSearchParams(useLocation().search);
  let reason = query ? query.get("reason") : "";
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const payment = useSelector(state => state.payment);

  const sendTicketByEmail = async () => {
    const ticketInfo = {
        payment: payment
    };
    console.log("mail3 " + payment);

    try {
      const response = await fetch("http://localhost:4000/api/sendTicketByEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, ticketInfo }),
      });
      console.log("mail2");

      if (response.ok) {
        setEmailSent(true);
      } else {
        const data = await response.json();
        alert(data.error || "Помилка відправки електронної пошти");
      }
    } catch (error) {
      console.error("Помилка відправки електронної пошти:", error);
      alert("Помилка відправки електронної пошти");
    }
  };

  return (
      <div className="status-container">
        <div className="status">
          {!emailSent ? (
              <>
                <img src={`../../../../public/image/${type === "failed" || type === "error" ? "failed" : "success"}.svg`} className="status-image" alt={type === "failed" || type === "error" ? "failed" : "success"} />
                {["failed", "error"].includes(type) ? null : <img src="../../../../public/image/thank-you.svg" className="status-image" alt="thank-you" />}
                <p className="status-message">{type === "failed" ? "The payment was refused. Please try a different payment method or card." : "Your order has been successfully placed."}</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                <button onClick={sendTicketByEmail} className="button">
                  Send Ticket by Email
                </button>
              </>
          ) : (
              <p className="status-message">The ticket has been sent to your email address.</p>
          )}
          <Link to="/" className="button">
            Return Home
          </Link>
        </div>
      </div>
  );
};
