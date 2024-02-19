import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
  ListGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate, useParams } from "react-router-dom";

import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { orderCreateReducer } from "../reducers/orderReducers";
import {
  createOrder,
  deliverOrder,
  getOrderDetails,
  payOrder,
} from "../actions/orderActions";
import { ORDER_CREATE_RESET, ORDER_DELIVER_RESET, ORDER_PAY_RESET } from "../constants/orderConstants";
import Loader from "../components/Loader";
import { PayPalButton } from "react-paypal-button-v2";

const OrderScreen = () => {
  const { id } = useParams();

  const orderId = id;
  console.log(orderId, "orderId");

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successpay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  if (!loading && !error) {
    order.itemPrice = order.OrderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    ).toFixed(2);
  }

  //AbIn6nbEiZkzoIECy3DhlNspL56qgjUH-J9Qgn3YtR18K3Q94VLfYc_CqQ2gUGms5IMzXjfzbHlPz7WP

  const addPayPalScript = () => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://www.paypal.com/sdk/js?client-id=AbIn6nbEiZkzoIECy3DhlNspL56qgjUH-J9Qgn3YtR18K3Q94VLfYc_CqQ2gUGms5IMzXjfzbHlPz7WP'
    script.async = true
    script.onload = () => {
        setSdkReady(true)
    }
    document.body.appendChild(script)
}


  useEffect(() => {
    if (!userInfo){
      navigate('/login')
    }
    if (!order || successpay || order._id !== Number(orderId) || successDeliver) {
      dispatch({type:ORDER_PAY_RESET})
      dispatch({type:ORDER_DELIVER_RESET})
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId,successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Row>
        <h2>Order : {order._id}</h2>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <p>
                <strong>Name :</strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email :</strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>

              <p>
                <strong>Shipping:</strong>
                {order.ShippingAddress.address}, {order.ShippingAddress.city}{" "}
                {order.ShippingAddress.postalcode},{" "}
                {order.ShippingAddress.country},
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>

              <p>
                <strong>Method:</strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Not Paid </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.OrderItems.length === 0 ? (
                <Message variant="info">Order is Empty </Message>
              ) : (
                <ListGroup variant="flush">
                  {order.OrderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Link to={`/product/${item.product}`}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Link>
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Item:</Col>
                  <Col>${order.itemPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>

            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button type="button" className="btn btn-block my-3 mx-4" style={{width:'85%'}} onClick={deliverHandler}>
                  Mark As Deliver
                </Button>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
