const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const router = Router();

router.post('/add', (req, res) => {
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
        req.session.message = 'There is a problem with your request. Please try again.';
        res.redirect('/');
      } else if (response.statusCode === 200) {
        req.session.message = 'Room is successfully added to the system.';
        req.session.newRoom = body.roomId;
        res.redirect('/');
      } else {
        req.session.message = 'There is a problem with your request. Please try again.';
        res.redirect('/');
      }
    });
  }
});

router.get('/delete/:id', (req, res) => {
  const id = req.params.id;

  request({
    url: `${directory}/admin/room/${id}`,
    method: 'DELETE',
    headers: {
      adminAuth: req.cookies['AuthToken']
    }
  }, (error, response, body) => {
    if (error) {
      req.session.message = 'There is a problem deleted the room. Please try again.';
      res.redirect('/');
    } else if (response.statusCode === 200) {
      req.session.message = 'Room is successfully deleted.';
      res.redirect('/');
    } else if (response.statusCode === 404) {
      req.session.message = 'The reservation you are trying to cancel does not exist.';
      res.redirect('/');
    } else {
      req.session.message = 'There is a problem deleted the room. Please try again.';
      res.redirect('/');
    }
  });
});

module.exports = router;