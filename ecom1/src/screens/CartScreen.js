import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link,  useLocation,  useNavigate,  useParams } from "react-router-dom";
import { ImBin } from "react-icons/im";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Loader from "../components/Loader";

const CartScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);
  const qty = searchparams.get("qty");
  const navigate=useNavigate()
  const userLogin = useSelector((state) => state.userLogin);
    
  const { error, loading, userInfo } = userLogin;
  
  //const qty = location.search ? location.search.split("=")[1]:1
  //console.log(qty)
  //console.log(id)

  const dispacth = useDispatch();

  const cart = useSelector((state) => state.cart);

  const { cartItems } = cart;



  //console.log(cartItems)

  useEffect(() => {
    if (id) {
      dispacth(addToCart(id, Number(qty)));
    }
  }, [dispacth, id, qty]);

    const removeFromCartHandler = (id) =>{
    dispacth(removeFromCart(id))
  }

  const checkOutHandler=()=>{

    if (userInfo){

      navigate('/shipping')


    }
    else{
      navigate('/login')
    }

    
  }
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is Empty <Link to="/">Go back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Link to={`/product/${item.product}`} ><Image src={item.image} alt={item.name} fluid rounded /></Link>
                    
                  </Col>

                  <Col md={3}>
                    <Link to={`/product/${item.product}`} className="text-decoration-none">{item.name}</Link>
                  </Col>

                  <Col md={2}>${item.price}</Col>
                  <Col md={3}>
                    {console.log(item.countInStock,'countinstock')}
                  <Form.Control
                          as="select"
                          value={item.qty}
                          onChange={(e) => dispacth(addToCart(item.product,Number(e.target.value)))}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option value={x + 1} key={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                  </Col>

                  <Col md={1}>
                    <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.product)}>
                        <ImBin />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>

        <Card>
            <ListGroup variant="flush">

                <ListGroup.Item>
                    <h2>Subtotal({cartItems.reduce((acc,item) => acc+item.qty, 0)})</h2>

                    ${cartItems.reduce((acc,item) => acc+item.qty*item.price, 0).toFixed(2)}
                </ListGroup.Item>

                <ListGroup.Item>
                    <Button
                    type="button"
                    className="btn-block"
                    disabled={cartItems.length === 0}
                    onClick={checkOutHandler}
                    style={{width:'100%'}}>
                        Proceed To Checkout
                    </Button>
                </ListGroup.Item>

            </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
