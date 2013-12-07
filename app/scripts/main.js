var uri = new Uri(window.location.href);
var fartlek = {
  warmup:  { 
    duration: parseInt(uri.getQueryParamValue('warmup')),
    intensity: 1
  },
  hard: {
    duration: parseInt(uri.getQueryParamValue('hard')),
    intensity: 5
  },
  recover: { 
    duration: parseInt(uri.getQueryParamValue('recover')),
    intensity: 2
  }
};

var person = {
  fitnessLevel: parseInt(uri.getQueryParamValue('fitness')),
};

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

function updateSequencer(intensity) {
  console.log("updateing sequencer to intencity " + intensity);
}

function setNextPhase(lastPhase, lastPhaseIndex) {
  // if we're at the last phase, finish
  if (lastPhaseIndex >= (phases.length - 1)) {
    sequencer.stop();
    $button.text("Start!");
  } else {
    var nextPhaseIndex = lastPhaseIndex + 1,
        nextPhase = phases[nextPhaseIndex];
    window.setTimeout(function() {
      console.log("set timeout for " + nextPhase + " index " + nextPhaseIndex)
      setPhase(nextPhase, nextPhaseIndex);
    }, (fartlek[lastPhase]['duration'] * 1000))
  }
}

function setPhase(phase, index) {
  updateSequencer(fartlek[phase]['intensity']);
  window.setTimeout(function() {
    setNextPhase(phase, index);
  }, (fartlek[phase]['duration'] * 1000))
}

var $button = $('.control'),
    phases = Object.keys(fartlek);

$button.on('click', function(ev) {
  ev.preventDefault();

  console.log("BUTTON!");

  if (p.playing) {
    p.stop();
    $button.text("Start!");
  } else {
    console.log("starting playing");
    setPhase(phases[0], 0);
    p.play()
    $button.text("Stop!")
  }
})
