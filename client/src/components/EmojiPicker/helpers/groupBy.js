// https://stackoverflow.com/a/34890276/9931154
// https://stackoverflow.com/a/61400956/9931154
export const groupBy = (xs = [], key) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
