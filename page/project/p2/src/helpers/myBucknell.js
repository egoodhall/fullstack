import _ from 'lodash';



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
  getUserEmail
};
