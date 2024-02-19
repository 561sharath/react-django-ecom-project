import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, keyword = "", isAdmin = false }) => {
  if (keyword) {
    keyword = keyword.split('?keyword=')[1].split('&')[0]
}

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={ !isAdmin ? ({
              
              search: `keyword=${keyword}&page=${x + 1}`,

            }):(
              {
                
                search: `keyword=${keyword}&page=${x + 1}`
              }
            )
          }
          >
            <Pagination.Item 
            active={x+1 === Number(page)}
            className="m-1">{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
