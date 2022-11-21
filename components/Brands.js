import classes from "./Brands.module.scss";

function Brands() {
  const brands = [
    {
      title: "odin hall",
    },
    {
      title: "odin hall",
    },
    {
      title: "odin hall",
    },
    {
      title: "odin hall",
    },
    {
      title: "odin hall",
    },
    {
      title: "odin hall",
    },
    {
      title: "odin hall",
    },
  ];
  return (
    <div className={classes.brands}>
      {brands.map((brands, index) => (
        <div key={index} className={classes.brand}>
          <p>{brands.title}</p>
        </div>
      ))}
    </div>
  );
}

export default Brands;
