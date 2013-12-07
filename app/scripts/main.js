var uri = new Uri(window.location.href);
var fartlek = {
  warmup:  parseInt(uri.getQueryParamValue('warmup')),
  hard:    parseInt(uri.getQueryParamValue('hard')),
  recover: parseInt(uri.getQueryParamValue('recover'))
};
console.log(fartlek);

var context = new webkitAudioContext();

// create a new step sequencer with parameters:
// (audio context, step length, sequence of frequences)
var sequencer = new StepSequencer(context, 1, [440, 660, 440, 400]);

// method to inject other audio nodes at the end of the graph
sequencer.setupAudio();

var Player = function(sequencer) {
  this.playing = false;
  this.sequencer = sequencer;
}

Player.prototype.play = function() {
  this.playing = true;
  sequencer.play();
}

Player.prototype.stop = function() {
  this.playing = false;
  sequencer.stop();
}

p = new Player(sequencer)


var $button = $('.control'),
    $faster = $('.faster'),
    $slower = $('.slower');

$button.on('click', function(ev) {
  ev.preventDefault();

  if (p.playing) {
    p.stop();
    $button.text("Play!");
  } else {
    p.play()
    $button.text("Stop!")
  }
})


$faster.on('click', function(ev) {
  ev.preventDefault();

  sequencer.stepLength = sequencer.stepLength * 0.5;
  sequencer.sequencerCurrentTimeOffset = sequencer.sequencerCurrentTimeOffset * 0.5;
})

$slower.on('click', function(ev) {
  ev.preventDefault();

  sequencer.stepLength = sequencer.stepLength / 0.5;
  sequencer.sequencerCurrentTimeOffset = sequencer.sequencerCurrentTimeOffset / 0.5;
})
