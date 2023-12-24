import React, { useEffect } from "react";
import DataTable from "./DataTable";
import { useDispatch, useSelector } from "react-redux";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import { baseURL, editUser, getAllUsers } from "../../api";
import { avatar } from "../../assets";

import { alertNULL, alertSuccess } from "../../context/actions/alertActions";

const ListStoreConfirm = () => {
  const allUsers = useSelector((state) => state.allUsers);


  const dispatch = useDispatch();
  const isStore = allUsers
    ? allUsers.filter((store) => store?.store !== null &&store.isStore===false)
    : [];



  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  });

  const acceptStore = async (rowData) => {
    try {
      const userId = rowData.id;
      const newData = {
        isStore: !rowData.isStore,
      };

      const updatedUserData = await editUser(userId, newData);

      if (updatedUserData) {
        getAllUsers().then((data) => {
          dispatch(setAllUserDetail(data));
        });
        dispatch(alertSuccess("Cập nhật thành công  "));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };
  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
         


          
          {
            title: <p className="font-semibold text-xl">Name</p>,
            field: "store",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.store}</p>
            ),
          },

          {
            title: <p className="font-semibold text-xl">Owner</p>,
            field: "name",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.name}</p>
            ),
          },

          {
            title: <p className="font-semibold text-xl">Address</p>,
            field: "address",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.address}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Phone</p>,
            field: "phone",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.phone}</p>
            ),
          },
         
          {
            title: <p className="font-semibold text-xl">Accept</p>,
            field: "isStore",
            render: (rowData) => (
              <select
                value={rowData.isStore}
                onChange={() => acceptStore(rowData)}
                className="border rounded-md bg-cardOverlay w-24 h-10 font-semibold"
                style={{ color: rowData.isStore === true ? "blue" : "red" }}
              >
                <option value="true" className="font-semibold text-blue-500">
                  Accept
                </option>
                <option value="false" className="font-semibold text-red-500">
                Opposite
                </option>
              </select>
            ),
          },
        ]}
        data={isStore}
        title={
          <p className="font-semibold text-red-400 text-3xl">List of Stores Wait Confirm</p>
        }
      />
    </div>
  );
};

export default ListStoreConfirm;
