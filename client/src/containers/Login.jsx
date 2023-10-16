import React, { useEffect, useState } from "react";
import { faceLogo, igLogo, loginBg, logo } from "../assets";
import { LoginInput } from "../components";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle, FcIphone } from "react-icons/fc";
import { motion } from "framer-motion";
import { buttonClick, fadeInOut } from "../animations";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
} from "firebase/auth";
import { app } from "../config/firebase.config";
import { validateUserJWTToken } from "../api";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "../context/actions/userActions";
import { alertDanger, alertInfo } from "../context/actions/alertActions";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const provider1 = new FacebookAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  const loginWithFacebook = async () => {
    await signInWithPopup(firebaseAuth, provider1).then((userCred) => {
      firebaseAuth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUserJWTToken(token).then((data) => {
              dispatch(setUserDetail(data));
            });
            navigate("/", { replace: true });
          });
        }
      });
    });
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      firebaseAuth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUserJWTToken(token).then((data) => {
              dispatch(setUserDetail(data));
            });
            navigate("/", { replace: true });
          });
        }
      });
    });
  };

  const signUpWithEmailPass = async () => {
    if (userEmail === "" || password === "" || confirm_password === "") {
      dispatch(alertInfo("Require fields should not be empty"));
    } else {
      if (password === confirm_password) {
        setUserEmail("");
        setPassword("");
        setConfirm_password("");
        await createUserWithEmailAndPassword(
          firebaseAuth,
          userEmail,
          password
        ).then((userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then((data) => {
                  dispatch(setUserDetail(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        });
      } else {
        dispatch(alertDanger("Password wrong!"));
      }
    }
  };

  const signInWithEmailPass = async () => {
    if (userEmail !== "" && password !== "") {
      await signInWithEmailAndPassword(firebaseAuth, userEmail, password).then(
        (userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then((data) => {
                  dispatch(setUserDetail(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        }
      );
    } else {
      dispatch(alertDanger("Password wrong!"));
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-auto  bg-lighttextGray gap-4">
      {/*background image */}
      {/* <img
        src={loginBg}
        className="w-full h-full absolute object-cover top-0 left-0"
        alt=""
      ></img> */}
      {/*Navbar*/}
      <div className="flex flex-col items-center bg-cardOverlay  md:w-auto h-auto z-10 backdrop-blur-md   ">
        <div className="w-screen h-[5px] bg-green-300" />

        <div className="flex items-center gap-6">
          <img src={logo} className="w-12" alt="" />
          <p className="flex font-bold text-3xl text-green-700">6Food</p>
        </div>
      </div>
      {/* container box */}
      <div className="  mt-3 flex flex-col items-center bg-cardOverlay w-[80%] md:w-508 h-510 z-10 backdrop-blur-md p-4 px-4 py-1 mx-auto  gap-4">
        {/* Welcome text  */}
        <p className="flex text-xl font-semibold text-headingColor">
          Chào Mừng!{" "}
        </p>
        <p className="text-xl  text-textColor -mt-4">
          {!isSignUp ? "Đăng nhập " : "Đăng ký "} bằng cách sau{" "}
        </p>

        {/* input section */}
        <div className="w-full flex flex-col items-center justify-center gap-4 px-4 md:px-12 py-1">
          <LoginInput
            placeHolder={"Email "}
            icon={<FaEnvelope className="text-xl text-textColor" />}
            inputState={userEmail}
            inputStateFunc={setUserEmail}
            type="email"
            isSignUp={isSignUp}
          />

          <LoginInput
            placeHolder={"Mật khẩu"}
            icon={<FaLock className="text-xl text-textColor" />}
            inputState={password}
            inputStateFunc={setPassword}
            type="password"
            isSignUp={isSignUp}
          />
          {isSignUp && (
            <LoginInput
              placeHolder={"Xác nhận mật khẩu"}
              icon={<FaLock className="text-xl text-textColor" />}
              inputState={confirm_password}
              inputStateFunc={setConfirm_password}
              type="password"
              isSignUp={isSignUp}
            />
          )}

          {!isSignUp ? (
            <p className="font-medium">
              Chưa có tài khoản tại 6Food? {""}
              <motion.button
                {...buttonClick}
                className="text-cartNumBg bg-transparent cursor-pointer underline"
                onClick={() => setIsSignUp(true)}
              >
                Đăng ký
              </motion.button>
            </p>
          ) : (
            <p className="font-medium">
              Đã có tài khoản tại 6Food? {"     "}
              <motion.button
                {...buttonClick}
                className="text-cartNumBg bg-transparent cursor-pointer underline"
                onClick={() => setIsSignUp(false)}
              >
                Đăng nhập
              </motion.button>
            </p>
          )}

          {/* signin button */}
          {!isSignUp ? (
            <motion.button
              {...buttonClick}
              onClick={signInWithEmailPass}
              className="bg-red-400 rounded-md w-full px-4 py-2 text-center text-xl text-white font-medium hover:bg-red-500 transition-all duration-100"
            >
              Đăng Nhập
            </motion.button>
          ) : (
            <motion.button
              {...buttonClick}
              className="bg-red-400 rounded-md w-full px-4 py-2 text-center text-xl text-white font-medium hover:bg-red-500 transition-all duration-100"
              onClick={signUpWithEmailPass}
            >
              Đăng Ký
            </motion.button>
          )}
        </div>

        <div className=" flex items-center justify-between gap-16">
          <div className="w-24 h-[1px] rounded-md bg-gray-500 "></div>
          <p className="text-gray-600 font-medium">hoặc</p>
          <div className="w-24 h-[1px] rounded-md bg-gray-500"></div>
        </div>

        <motion.div
          {...buttonClick}
          className="flex justify-start items-center bg-cardOverlay w-[80%] backdrop-blur-md cursor-pointer px-4 py-2 mx-auto rounded-3xl gap-16"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-3xl " />
          <p className="flex text-center capitalize text-base text-headingColor font-medium">
            Đăng Nhập Bằng Gmail
          </p>
        </motion.div>
        <motion.div
          {...buttonClick}
          className=" flex justify-start items-center bg-cardOverlay w-[80%] backdrop-blur-md cursor-pointer px-4 py-2 mx-auto rounded-3xl gap-10"
          onClick={loginWithFacebook}
        >
          <FcIphone className="text-3xl" />
          <p className="  flex text-center capitalize text-base text-headingColor font-medium  ">
            Đăng Nhập Bằng Số Điện Thoại
          </p>
        </motion.div>
      </div>
      <div className=" mt-1 flex flex-col items-center w-[80%] md:w-508 h-auto z-20 backdrop-blur-md p-4 px-4 py-2 mx-auto  gap-1">
      <p className="flex text-xl font-medium text-headingColor">
          THEO DÕI CHÚNG TÔI TRÊN {" "}
        </p>
        <div className="relative cursor-pointer flex gap-16">
            <motion.div
              className="w-14 h-14 rounded-full flex justify-center items-center "
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
              onClick={() =>
                (window.location.href = "https://www.facebook.com/thaii17")
              }
            >
              <img src={faceLogo} alt="" className="w-full h-full" />
            </motion.div>

            <motion.div
              className="w-14 h-14 rounded-full flex justify-center items-center"
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
              onClick={() =>
                (window.location.href = "https://www.instagram.com/thaii1710/")
              }
            >
              <img src={igLogo} alt="" className="w-full h-full" />
              
            </motion.div>
            
          </div>
          <p className="flex text-xl font-medium text-textColor gap-12">Facebook
              <p>Instagram</p>
          </p>
          
      </div>
    </div>
  );
};

export default Login;
