import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, getAllProducts, getAllUsers } from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { CChart } from "@coreui/react-chartjs";
import { budget, confirmOrders, store, totalUser } from "../../assets";
import { FaDongSign } from "react-icons/fa6";
import { setOrders } from "../../context/actions/orderAction";
import { setAllUserDetail } from "../../context/actions/allUsersAction";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);
  const users = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();
  

  const category = products
    ? [
        ...new Set(
          products
            .filter((item) => item && item.category && item.category.name) 
            .map((item) => item.category.name)
            .filter((name) => name !== "length")
        ),
      ]
    : [];

  const sts = orders ? orders.map((order) => order.status) : [];

  const countStatus = (status) => {
    return sts.reduce((count, currentStatus) => {
      return currentStatus === status ? count + 1 : count;
    }, 0);
  };

  const preparingCount = countStatus("Pending");
  const cancelledCount = countStatus("Shipping");
  const deliveredCount = countStatus("Done");
  const categoryCounts = {};
  if (products) {
    products.forEach((product) => {
      const category = product.category.name;

      if (categoryCounts[category]) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });
  }
  const isStore = users ? users.filter((store) => store?.isStore === true) : [];

  const totalRevenue = orders
    ? orders.reduce((total, order) => total + (order.totalPrice * 1000 || 0), 0)
    : 0;

  const numberPaypal = orders
    ? orders.filter((order) => order.isPay === true).length
    : [];
  const numberMoney = orders ? orders.length - numberPaypal : 0;

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
    if (!orders) {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    }
    if (!users) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  });

 


  return (
    <div className="flex items-start justify-center flex-col pt-12 w-full   gap-8 h-full">
      <div className="items-start justify-start  gap-16 flex pt-12">
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-3 py-4">
          <img
            alt=""
            src={confirmOrders}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Orders
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {orders?.length}
            </p>
          </div>
        </div>
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative   py-4">
          <img
            alt=""
            src={budget}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Revenue
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {totalRevenue.toLocaleString("vi-VN")}
              <FaDongSign className="text-red-400" />
            </p>
          </div>
        </div>

        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-3 py-4">
          <img
            alt=""
            src={totalUser}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Users
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {users?.length}
            </p>
          </div>
        </div>
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-3 py-4">
          <img
            alt=""
            src={store}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Stores
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {isStore?.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-40 h-full">
        <div className="flex items-center justify-center ">
          <div className="w-508 md:w-656">
            <CChart
              type="bar"
              data={{
                labels: category,
                datasets: [
                  {
                    label: "Category Count",
                    backgroundColor: [
                      "#36A2EB",
                      "#FF6384",
                      "#4BC0C0",
                      "#FFCE56",
                      // "#E7E9ED",
                      "#36A2EB",
                    ],
                    data: categoryCounts,
                  },
                ],
              }}
              labels="category"
            />
          </div>
        </div>
        <div className="w-340 md:w-375 items-center justify-center">
          <CChart
            type="polarArea"
            data={{
              labels: ["Pending", "Shipping", "Done", "PayPal", "Money"],
              datasets: [
                {
                  data: [
                    preparingCount,
                    deliveredCount,
                    cancelledCount,
                    numberPaypal,
                    numberMoney,
                  ],
                  backgroundColor: [
                    "#FF6384",
                    "#4BC0C0",
                    "#FFCE56",
                    "#1255e6",
                    "#45e31e",
                  ],
                },
              ],
            }}
          />
        </div>
        <CChart
        type='line'
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: '2019',
              backgroundColor: 'rgba(179,181,198,0.2)',
              borderColor: 'rgba(179,181,198,1)',
              pointBackgroundColor: 'rgba(179,181,198,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(179,181,198,1)',
              tooltipLabelColor: 'rgba(179,181,198,1)',
              data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
              label: '2020',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              pointBackgroundColor: 'rgba(255,99,132,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(255,99,132,1)',
              tooltipLabelColor: 'rgba(255,99,132,1)',
              data: [28, 48, 40, 19, 96, 27, 100]
            }
          ],
        }}  
        options={{
          aspectRatio: 1.5,
          tooltips: {
            enabled: true
          }
        }}
      />

      </div>
      
      
    </div>
  );
};





export default DBHome;
