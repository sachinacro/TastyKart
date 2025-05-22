import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url="http://localhost:4000"
    const[token,setToken]=useState("")
    const [food_list,setFoodList] = useState([])  //remove itemm

    // here start addToCart functionality 
    const addToCart = async(itemId) => {
        // if in cart-items cart-id is not available 
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        // if cart-id is available
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    // remove addToCart functionality
    const removeFromCart = async(itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }

    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfor = food_list.find((product) => product._id === item)
                totalAmount += itemInfor.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async()=>{
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }

    const loadCartData = async(token)=>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData)
    }

    useEffect(()=>{
    //    if (localStorage.getItem("token")) {
    //     setToken(localStorage.getItem("token"));
    //    }
       async function loadData(){
        await fetchFoodList()
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            await loadCartData(localStorage.getItem("token"))
           }
       }
       loadData();
    },[])  //remove the data on local storage

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;
// import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
// import { axios } from 'axios';

// export const StoreContext = createContext(null)

// const StoreContextProvider = (props) => {

//     const [cartItems, setCartItems] = useState({});
//     const url="http://localhost:4000"
//     const [token,setToken] =useState("");

//     // here start addToCart functionality 
//     const addToCart = (itemId) => {
//         // if in cart-items cart-id is not available 
//         if (!cartItems[itemId]) {
//             setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
//         }
//         // if cart-id is available
//         else {
//             setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
//         }
//     }

//     // remove addToCart functionality
//     const removeFromCart = (itemId) => {
//         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))

//     }

//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
//         for (const item in cartItems) {
//             if (cartItems[item] > 0) {
//                 let itemInfor = food_list.find((product) => product._id === item)
//                 totalAmount += itemInfor.price * cartItems[item];
//             }
//         }
//         return totalAmount;
//     }

//     const fetchFoodList = async()=>{
//         const response = await axios.get(url+"/api/food/list");
//         setFoodList(response.data.data)
//     }

//     useEffect(()=>{
      
//             if (localStorage.getItem("token")) {
//                 setToken(localStorage.getItem("token"))
//             }
    
        
//     },[])

//     const contextValue = {
//         food_list,
//         cartItems,
//         setCartItems,
//         addToCart,
//         removeFromCart,
//         getTotalCartAmount,
//         url,
//         token,
//         setToken
//     }
//     return (
//         <StoreContext.Provider value={contextValue}>
//             {props.children}
//         </StoreContext.Provider>
//     )
// }
// export default StoreContextProvider;
// import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";

// export const StoreContext = createContext(null)

// const StoreContextProvider = (props) => {

//     const [cartItems, setCartItems] = useState({});
//     const url= "http://localhost:4000"
//     const [token,setToken] = useState("");
//     const [food_list,setFoodList] = useState([])

//     // here start addToCart functionality 
//     const addToCart = (itemId) => {
//         // if in cart-items cart-id is not available 
//         if (!cartItems[itemId]) {
//             setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
//         }
//         // if cart-id is available
//         else {
//             setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
//         }
//     }

//     // remove addToCart functionality
//     const removeFromCart = (itemId) => {
//         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))

//     }

//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
//         for (const item in cartItems) {
//             if (cartItems[item] > 0) {
//                 let itemInfor = food_list.find((product) => product._id === item)
//                 totalAmount += itemInfor.price * cartItems[item];
//             }
//         }
//         return totalAmount;
//     }

//     useEffect(()=>{
//         if (localStorage.getItem("token")) {
//             setToken(localStorage.getItem("token"));

            
//         }
//     },[])

//     const contextValue = {
//         food_list,
//         cartItems,
//         setCartItems,
//         addToCart,
//         removeFromCart,
//         getTotalCartAmount,
//         url,
//         token,
//         setToken
//     }
//     return (
//         <StoreContext.Provider value={contextValue}>
//             {props.children}
//         </StoreContext.Provider>
//     )
// }
// export default StoreContextProvider;