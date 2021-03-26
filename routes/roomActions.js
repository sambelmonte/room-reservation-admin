const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const { decryptKey } = require('../tools/encrypt');
const log = require('../tools/log');
const router = Router();

router.post('/add', (req, res) => {
  const { username } = decryptKey(req.cookies['AuthToken']);

  if (!req.body.roomName) {
    req.session.message = 'Room Name is required.';
    res.redirect('/');
  } else {
    const { roomName } = req.body;

    request({
      url: `${directory}/admin/room`,
      method: 'POST',
      headers: {
        adminAuth: req.cookies['AuthToken']
      },
      json: {
        name: roomName
      }
    }, (error, response, body) => {
      if (error) {
        log('POST /add', 'request', username, error);
        req.session.message = 'There is a problem with your request. Please try again.';
        res.redirect('/');
      } else if (response.statusCode === 200) {
        req.session.message = 'Room is successfully added to the system.';
        req.session.newRoom = body.roomId;
        res.redirect('/');
      } else {
        log('POST /add', 'request', username, request);
        req.session.message = 'There is a problem with your request. Please try again.';
        res.redirect('/');
      }
    });
  }
});

router.get('/delete/:id', (req, res) => {
  const { username } = decryptKey(req.cookies['AuthToken']);
  const id = req.params.id;

  request({
    url: `${directory}/admin/room/${id}`,
    method: 'DELETE',
    headers: {
      adminAuth: req.cookies['AuthToken']
    }
  }, (error, response, body) => {
    if (error) {
      log('GET /delete', 'request', username, error);
      req.session.message = 'There is a problem deleted the room. Please try again.';
      res.redirect('/');
    } else if (response.statusCode === 200) {
      req.session.message = 'Room is successfully deleted.';
      res.redirect('/');
    } else if (response.statusCode === 404) {
      req.session.message = 'The reservation you are trying to cancel does not exist.';
      res.redirect('/');
    } else {
      log('GET /delete', 'request', username, response);
      req.session.message = 'There is a problem deleted the room. Please try again.';
      res.redirect('/');
    }
  });
});

module.exports = router;