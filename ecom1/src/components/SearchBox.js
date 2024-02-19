import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const submitHandler = (e) => {
    e.preventDefault()

    if (keyword){
        navigate(`/?keyword=${keyword}&page=1`)
    }

    else{
        navigate(navigate(location.pathname))

    }
    // Add navigation logic here if you want to redirect after submitting
    // navigate(`/search/${keyword}`)
  }

  return (
    <Form onSubmit={submitHandler} style={{ display: 'flex', alignItems: 'center'}}>
      <Form.Control
        type='text'
        name='q'
        placeholder='search'
        onChange={(e) => setKeyword(e.target.value)}
        className='mr-sm-2 ml-sm-5'
        style={{ flexGrow: 1 }}
        // Allows the input to grow and fill available space
      />
      <Button type='submit' variant='outline-success' className='m-2'>
        Submit
      </Button>
    </Form>
  )
}

export default SearchBox
