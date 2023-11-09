import React, { useEffect, useState } from 'react';
import { Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const [datas, setDatas] = useState([]); // Initialize with an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState();
  const toast = useToast();
  const handleDeleteBtn = async (e, id) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/cart/deleteCartItem',
        {
          productId: e,
        },
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        toast({
          title: 'Delete Item Successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/cart/postCart',
        {
          date,
        },
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        console.log('ok');
      }
    } catch (err) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/cart/', {
          headers: {
            cookie: 'test',
            access_token: localStorage.getItem('accessToken'),
          },
          withCredentials: true,
        });
        if (res.status === 200) {
          setDatas(res.data);
        }
      } catch (err) {
        console.error(err); // Changed 'console.log' to 'console.error' for error logging
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const cartItems = datas.cartItems;
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='container'>
          <div className='cart-container'>
            <div className='row'>
              <div className='col-lg-8 product-content-left-big-img'>
                {cartItems.map((item) => (
                  <>
                    <div className='d-flex align-items-center gap-5 mb-5'>
                      <img
                        className='cart_img'
                        src={
                          'http://localhost:5000/src/public/images/' +
                          item.productID.images
                        }
                        alt='Book Cover' // Added 'alt' attribute for image
                      />
                      <h4 className='fw-bold m-0'>{item.productID.name}</h4>
                      <span className='cart_price'>{item.productID.price}</span>
                      <button
                        onClick={() => handleDeleteBtn(item.productID._id)}
                        className=''
                      >
                        <i className='cart_delete-btn fas fa-trash-can'></i>
                      </button>
                    </div>
                  </>
                ))}
              </div>
              <div className='col-lg-4 product-content-left-small-img'>
                <div className='div2'>
                  <h1 className='text-center'>Summary</h1>
                  <div className='d-flex align-items-center justify-content-between product-content-left-big-img'>
                    <p className='m-0'>Quantity</p>
                    <span>{datas.cartItemCount}</span>
                  </div>
                  <div className='d-flex align-items-center justify-content-between product-content-left-big-img'>
                    <p className='m-0'>Total</p>
                    <span className='cart_price'>{datas.totalPrice}</span>
                  </div>
                  <div className='form-group fw-bold d-flex justify-content-between mt-1'>
                    <label htmlFor='date'>Chọn ngày thuê</label>
                    <form onSubmit={handleSubmit} action=''>
                      <div className='controls border'>
                        <input
                          className='datePicker'
                          type='date'
                          id='date'
                          name='date'
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                      <button
                        type='submit'
                        className='cart_order-btn text-white'
                      >
                        Order Now!
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
