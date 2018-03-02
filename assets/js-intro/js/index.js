const w = {
  b: 2 
};
const a = 1;
let x = {
  a: a,
  w: w
}

let y = {
  a: a,
  w: {
    b: 2
  }
}

console.log(x == y);
console.log(x === y);


y.w = x.w;
y.a = x.a;

console.log(x == y);
console.log(x === y);

y = x;

console.log(x == y);
console.log(x === y);
