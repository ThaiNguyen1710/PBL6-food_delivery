import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { addNewItemToCart, baseURL, getAllCartItems } from "../../api";
import { FaDongSign } from "react-icons/fa6";
import { motion } from "framer-motion";
import { MdAccessTimeFilled } from "react-icons/md";
import { buttonClick } from "../../animations";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";

import { BiChevronsLeft } from "react-icons/bi";
import Footer from "../Footer";
import Cart from "../Cart";
import { alertDanger, alertNULL, alertSuccess } from "../../context/actions/alertActions";
import { setCartItems } from "../../context/actions/cartAction";
import { setCartOn } from "../../context/actions/displayCartAction";

const Product = ({  closeProduct }) => {
  const { id } = useParams();
  const product = useSelector((state) => state.products);
  const allUser = useSelector((state) => state.allUsers);
  const isCart = useSelector((state) => state.isCart);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productList = product ? product.filter((item) => item.id === id) : [];
  const selectedProduct = productList.length > 0 ? productList[0] : null;

  const userProduct = allUser
    ? allUser.filter((user) => user?.id === selectedProduct?.user?.id)
    : [];

 console.log (selectedProduct)
  if (!product) {
    navigate("/", { replace: true });
  }

  
 
  const sendToCart = async () => {
    try {
      const newData = {
        product: selectedProduct.id,
        user: user.user.userId,
      };
      console.log("New Data:", newData);
      const addedItem = await addNewItemToCart(newData);

      if (addedItem) {
        dispatch(alertDanger("Failed to add to cart"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        dispatch(alertSuccess("Added to the cart"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        const allCartItems = await getAllCartItems();
        if (allCartItems) {
          dispatch(setCartItems(allCartItems));
        }
      }
    } catch (error) {
      dispatch(alertDanger("Failed to add to cart"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };
  const handleButtonClick = () => {
    sendToCart();
    dispatch(setCartOn());
  };
  
  return (
    <div className="w-screen min-h-screen flex justify-start items-center flex-col bg-primary">
      <Header />
      <div className="w-full flex flex-col items-center justify-center mt-32 px-6 md:px-24 2xl:px-40 gap-2 pb-24 ">
        <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className=" flex items-start justify-start gap-6">
            <motion.button
              {...buttonClick}
              className="bg-gradient-to-bl from-orange-400 to-orange-600 px-2 py-2 rounded-xl text-black text-base font-semibold "
            >
              <NavLink to={"/"} className="flex justify-start">
                <BiChevronsLeft className="text-[50px] text-black" />
                <p className="font-semibold text-3xl text-white mt-2"> Back</p>
              </NavLink>
            </motion.button>

            <img
              alt=""
              src={baseURL + selectedProduct?.image}
              className="w-[80%] h-420 object-contain"
            ></img>
          </div>
          <div className=" flex flex-col items-center justify-start gap-16 ">
            <div className="w-508 h-370  items-center justify-center pt-8">
              <p className="text-blue-500 font-normal">
                Home {">> "}
                {userProduct?.[0]?.store}
                {" >> "}
                {selectedProduct?.name}
              </p>
              <div className=" pb-8 pt-8">
                <p className="text-5xl font-semibold">
                  {selectedProduct?.name}
                </p>
                <p className="text-xl text-gray-500 font-normal">
                  {selectedProduct?.category?.name}
                </p>
                <p className="text-xl  text-gray-500 font-normal">
                  Thông tin: {selectedProduct?.description}
                </p>
              </div>
              <div className="gap-12 pb-8">
              <p className="text-2xl font-medium flex gap-4">
              <MdAccessTimeFilled className="w-10 h-8 " /> {userProduct?.[0]?.openAt} :  {userProduct?.[0]?.closeAt}
                </p>
                <p className="text-2xl font-medium">
                  {userProduct?.[0]?.address}
                </p>
              </div>

              <p className=" text-3xl font-semibold text-red-500 flex gap-1">
                {parseFloat(selectedProduct?.price).toLocaleString("vi-VN")}
                <FaDongSign className="text-red-500" />{" "}
              </p>
              <motion.button
                {...buttonClick}
                className="bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-black text-base font-semibold "
                // onClick={() => dispatch(setCartOn())}
                onClick={handleButtonClick} 
              >
                Đặt Hàng Ngay
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      {isCart && <Cart/>}
      <Footer />
    </div>
  );
};

export default Product;
