const timeline = require('./timelineblue.json');
const fs = require('fs');

var junglePosX = [];
var junglePosY = [];
for (frame of timeline.frames) {
    if(!frame.participantFrames['5'].position) {
        console.log(frame.participantFrames['5']);
        continue;
    }
    console.log(frame.participantFrames['5']);
        continue;
    junglePosX.push(frame.participantFrames['5'].position.x);
    junglePosY.push(frame.participantFrames['5'].position.y);
}

console.log(junglePosX, junglePosY);