import React from "react";
import UserModel from "../../models/User";
import dbConnect from "../../services/dbConnect";

export default function Referral({ user }) {
  return (
    <div>
      <p>{user.name}</p>
    </div>
  );
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
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
