const { Router } = require('express');
const request = require('request');
const { directory } = require('../config/api.json');
const router = Router();

router.get('/', (req, res) => {
  request({
    url: `${directory}/admin/room`,
    method: 'GET',
    headers: {
      adminAuth: req.cookies['AuthToken']
    }
  }, (error, response, body) => {
    if (error) {
      res.render('rooms', {
        message: 'There is a problem loading the table. Please try again.'
      });
    } else if (response.statusCode === 200) {
      const { rooms } = JSON.parse(body);
      res.render('rooms', {
        hasRooms: rooms.length > 0,
        message: req.session.message,
        rooms: formatRooms(rooms, Number(req.session.newRoom))
      });
      delete req.session.message;
      delete req.session.newRoom;
    } else {
      res.render('rooms', {
        message: 'There is a problem loading the table. Please try again.'
      });
    }
  });
});

function formatRooms(rooms, newRoomId) {
  const newRooms = [];
  if (rooms.length === 0) {
    return newRooms;
  } 

  rooms.forEach((room) => {
    newRooms.push({
      ...room,
      newRoom: newRoomId === room.id
    });
  });
  return newRooms;
}

module.exports = router;