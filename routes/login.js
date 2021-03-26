const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const log = require('../tools/log');
const router = Router();

router.post('/', (req, res) => {
  const errors = [];
  if (!req.body.username) {
    errors.push('Username is required.');
  }
  if (!req.body.password) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    res.render('login', {
      message: errors.join(' ')
    });
  } else {
    const { username, password } = req.body;

    request({
      url: `${directory}/admin/login`,
      method: 'POST',
      json: {
        username,
        password
      }
    }, (error, response, body) => {
      if (error) {
        log('POST /login', 'request', req.body.username, error);
        res.render('home', {
          message: 'There is a problem with your request. Please try again.'
        });
      } else if (response.statusCode === 200) {
        res.cookie('AuthToken', body.key);
        res.redirect('/');
      } else if (response.statusCode === 400 || response.statusCode === 404) {
        res.render('home', {
          message: 'Wrong username and/or password.'
        });
      } else {
        log('POST /login', 'request', req.body.username, response);
        res.render('home', {
          message: 'There is a problem with your request. Please try again.'
        });
      }
    });
  }
});

module.exports = router;