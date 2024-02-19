import React, { useEffect, useState } from "react";
import products from "../Products";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProducts } from "../actions/productActions";
import { useLocation } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";


const HomeScreen = () => {
  const dispacth = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products,pages,page } = productList;
  

  const location = useLocation();
  const keyword = location.search



  //const keyword =searchparams.get("keyword");
  
  //const pagei=searchparams.get("page")

  
 
  useEffect(() => {
    dispacth(listProducts(keyword));
  }, [dispacth,keyword]);

  //const [products,setProducts]=useState([])

  return (
    <div>
      {!keyword && <ProductCarousel />}
      
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={'danger'}>{error}</Message>
      ) : (
        <div>
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>

           
        <Paginate page={page} pages={pages} keyword={keyword} isAdmin={false}/>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
