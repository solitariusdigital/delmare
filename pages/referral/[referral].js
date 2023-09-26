import { useEffect, useContext, useState } from "react";
import { StateContext } from "../../context/stateContext";
import UserModel from "../../models/User";
import dbConnect from "../../services/dbConnect";

export default function Referral({ user, referral }) {
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { referralData, setReferralData } = useContext(StateContext);

  useEffect(() => {
    setNavigationBottom(false);
    setMenu(true);
    setRegister(true);
    setReferralData({
      user: user,
      referral: referral,
    });
  }, [
    user,
    referral,
    setMenu,
    setNavigationBottom,
    setReferralData,
    setRegister,
  ]);
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let referral = context.params.referral;
    let users = await UserModel.find();
    let user = users.find((user) => user.phone.slice(-5) === referral);

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        referral: JSON.parse(JSON.stringify(referral)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
