
const threeMux = (d1, r1, d2, r2, r3) => {
  if (d1) {
    return r1;
  } else if (d2) {
    return r2;
  }
  return r3;
};

export {
  threeMux
};
