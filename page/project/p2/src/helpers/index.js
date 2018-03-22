import _ from 'lodash';


const threeMux = (d1, r1, d2, r2, r3) => {
  if (d1) {
    return r1;
  } else if (d2) {
    return r2;
  }
  return r3;
};

const fmtName = (name, middle = true) => {
  try {
    const parts = name.match(/([A-Za-z]+), ([A-Za-z]+) ?(.+)?/);
    return `${parts[2]}${middle ? ` ${parts[3]}` : ''} ${parts[1]}`;
  } catch (Error) {
    return name;
  }
};

const parseLink = (elem) => {
  const url = elem.match(/^<a href="(.+)">Desc<\/a>$/)[1].replace(/&amp;/g, '&');
  console.log(url);
  if (!_.startsWith(url, 'http')) {
    return `http://www.bannerssb.bucknell.edu${decodeURIComponent(url)}`;
  }
  return url;
};

export {
  threeMux,
  fmtName,
  parseLink
};
