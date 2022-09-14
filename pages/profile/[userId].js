import { useRouter } from "next/router";

function UserProfile() {
  const router = useRouter();

  let id = router.query.userId;

  return <p>The user page</p>;
}

// export async function getServerSideProps(context) {
//   // for authentication
//   const req = context.req;
//   const res = context.res
// }

export async function getStaticPaths() {
  // fetch IDs from db
  return {
    fallback: "blocking",
    paths: [
      {
        params: {
          userId: "u1",
        },
      },
      {
        params: {
          userId: "u2",
        },
      },
    ],
  };
}
// no longer need useEffect and useState
// runs before ProfilePage
export async function getStaticProps(context) {
  // fetch data from db

  const userId = context.params.userId;

  console.log(userId);

  // must return an object
  return {
    props: {
      data: "data",
    },
    // update page on serve side each 10s
    revalidate: 10,
  };
}

export default UserProfile;
