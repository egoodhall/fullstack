import _ from 'lodash';

const fmtName = (name, middle = true) => {
  try {
    const parts = name.match(/([A-Za-z]+), ([A-Za-z]+) ?(.+)?/);
    return `${parts[2]}${middle ? ` ${parts[3]}` : ''} ${parts[1]}`;
  } catch (Error) {
    return name;
  }
};

const getOrgStatus = (user, org, cb) => {
  // Returns a json object for the user
  fetch(`https://my.bucknell.edu/apps/mybucknell/framework.bucknelluser/${user}`)
    .then(res => res.json())
    .then(res => cb(res.OrgStatus === org));
};

const getUserEmail = (name, cb) => {
  fetch(`https://my.bucknell.edu/apps/mybucknell/framework.bucknelluser/search?name=${name}`)
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(res => {
      if (res.status !== 'success') {
        return '';
      }
      return cb(_.filter(res, (user) => getOrgStatus(user.Username, 'Employee'))[0].Username);
    });
};

export {
  getUserEmail,
  fmtName
};
