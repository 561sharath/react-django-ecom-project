import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Row,
  Col,
  ListGroup,
  Button,
  Card,
  Image,
  ListGroupItem,
  Form,
  option,
  
} from "react-bootstrap";
import Rating from "../components/Rating";

import products from "../Products";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { CreateProductReview, listProductsDetails } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_CREATE_REVIEW_REQUEST, PRODUCT_CREATE_REVIEW_RESET } from "../constants/productListConstants";

const ProductScreen = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const dispacth = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { loading:loadingProductReview, 
    error:errorProductReview, 
    success:successProductReview } = productReviewCreate;
  /*const [product,setProduct]=useState([])
  useEffect(() =>{
    async function fetchProducts(){
        const {data} = await axios.get(`/api/products/${id}`)
        setProduct(data)
    }

    fetchProducts()
  },[id])*/

  //const product = products.find((p) => p._id == id)
  //console.log(product)

  useEffect(() => {
    if (successProductReview){
      setRating(0)
      setComment('')
      dispacth({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispacth(listProductsDetails(id));
  }, [dispacth, id,successProductReview]);

  //const productDetails = useSelector((state) => state.productDetails);
  //const { loading, error, product } = productDetails;
  const navigate=useNavigate()
  const addToCartHandler=()=>{

    navigate(`/cart/${id}?qty=${qty}`)


    //console.log('added to cart',id)
  }

  const submitHandler=(e)=>{

    e.preventDefault()
    dispacth(CreateProductReview(
      id,{
        rating,
        comment
      }
    ))

  }
  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        <FaArrowLeft /> Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
        <Row>
          <Col md={6}>
            <Image
              className="rounded"
              src={product.image}
              alt={product.name}
              fluid
            />
          </Col>

          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                  color={"#f8e825"}
                />
              </ListGroup.Item>

              <ListGroup.Item>Price : ${product.price}</ListGroup.Item>

              <ListGroup.Item>
                Description : {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroupItem>
                    <Row>
                      <Col>Qty:</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option value={x + 1} key={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}

                <ListGroup.Item>
                  <Button
                    type="button"
                    disabled={product.countInStock == 0}
                    variant="primary"
                    style={{ width: "100%" }}
                    onClick={addToCartHandler}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <h4>Reviews</h4> 

            {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

            <ListGroup variant="flush">

              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>

                  <strong>{review.name}</strong>
                  <Rating value={review.rating} color='#f8e825'/>
                  <p>{review.createdAt.substring(0,10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}

              <ListGroup.Item>
                <h4>Write a review</h4>

                {loadingProductReview && <Loader />}
                {successProductReview && <Message variant='success'>Review Submitted</Message>}
                {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                {userInfo ? (
                  <Form onSubmit={submitHandler}>

                    <Form.Group controlId="rating">
                        <Form.Label>
                          Rating
                        </Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) =>setRating(e.target.value)}
                        >

                          <option value=''>
                              select....
                          </option>

                          <option value='1'>1-Poor</option>
                          <option value='2'>2-Fair</option>
                          <option value='3'>3-Good</option>
                          <option value='4'>4-Very Good</option>
                          <option value='5'>5-Excellent</option>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="comment">

                      <Form.Label>Review</Form.Label>

                      <Form.Control
                      as='textarea'
                      row='5'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      >

                      </Form.Control>

                    </Form.Group>

                    <Button disabled={loadingProductReview} type="submit" variant="primary" className="my-3">
                      Submit
                    </Button>

                  </Form>
                ):(
                  <Message variant='info'>Please <Link to='/login'>Login</Link> to write a review</Message>
                )}
              </ListGroup.Item>

            </ListGroup>
          </Col>
        </Row>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
