import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "", phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // Delivery Fee and GST Calculation
  const deliveryFee = 2; // Base delivery fee
  const gstRate = 18 / 100; // 18% GST
  const gstAmount = deliveryFee * gstRate; // GST on the delivery fee
  const totalAmount = getTotalCartAmount() + deliveryFee + gstAmount; // Total amount including GST and delivery fee

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = food_list.filter(item => cartItems[item._id] > 0)
      .map(item => ({ ...item, quantity: cartItems[item._id] }));

    const orderData = {
      userId: localStorage.getItem("userId"),
      address: data,
      items: orderItems,
      amount: totalAmount, // Updated total amount with GST and delivery fee
    };

    try {
      const res = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (res.data.success) {
        const options = {
          key: res.data.razorpayKey,
          amount: res.data.amount,
          currency: res.data.currency,
          name: "Food Delivery",
          description: "Order Payment",
          order_id: res.data.orderId,
          handler: async function (response) {
            // Send details for verification
            await axios.post(`${url}/api/order/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: res.data.newOrderId
            });

            alert("Payment successful!");
            window.location.href = "/myorders";
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone
          },
          theme: {
            color: "#3399cc"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Order failed to create");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  const navigate = useNavigate()
  useEffect(()=>{
     if (!token) {
      navigate("/cart")
     }
     else if(getTotalCartAmount()===0){
      navigate("/cart")
     }
  },[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone no.' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>GST (18%)</p>
              <p>₹{gstAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalAmount.toFixed(2)}</b> {/* Final total with GST and Delivery Fee */}
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;


// import React, { useContext, useEffect, useState } from 'react'
// import './PlaceOrder.css'
// import { StoreContext } from '../../context/StoreContext'
// import { axios } from 'axios';
// function PlaceOrder() {

//   const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);

//   const [data,setData]= useState({
//     firstName:"",
//     lastName:"",
//     email:"",
//     street:"",
//     city:"",
//     state:"",
//     zipcode:"",
//     country:"",
//     phone:""
//   })


//   const onChangeHandler = (event)=>{
//     const name = event.target.name;
//     const value = event.target.value;
//     setData(data=>({...data,[name]:value}))
//   }

//   const placeOrder = async(event)=>{
//      event.preventDefault();
//      let orderItems=[];
//      food_list.map((item)=>{
//          if (cartItems[item._id]>0) {
//           let itemInfo = item;
//           itemInfo["quantity"] = cartItems[item._id];
//           orderItems.push(itemInfo)
//          }
//      })
//    //  console.log(orderItems);
//    let orderData = {
//     address:data,
//     items:orderItems,
//     amount:getTotalCartAmount()+2, //delaivry charge

//      }
//      let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
//      if (response.data.success) {
//       const {session_url} = response.data;
//       window.location.replace(session_url)
//      }
//      else{
//       alert("error")
//      }
     
//   }

//   // useEffect(()=>{
//   //   console.log(data);
    
//   // },[data])

//   return (
//     <form onSubmit={placeOrder} className='place-order'>
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-fields">
//           < input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name'/>
//           < input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name'/>
//         </div>
//         < input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address'/>
//         < input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street'/>
//         <div className="multi-fields">
//           < input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
//           < input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State'/>
//         </div>
//         <div className="multi-fields">
//           < input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code'/>
//           < input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country'/>
//         </div>
//         < input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone no.'/>
//       </div>
//       <div className="place-order-right">
//       <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>₹{getTotalCartAmount()}</p>
//             </div>
//             <hr />

//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>₹{getTotalCartAmount()===0?0:2}</p>
//             </div>
//             <hr />

//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
//             </div>
//           </div>
//           <button type='submit'>PROCEED TO PAYMENT</button>
//         </div>
//       </div>
//     </form>
//   )
// }

// export default PlaceOrder
