const buttonStart = document.getElementById('start');
const buttonStop = document.getElementById('stop');

const voice = new Wad({ source: 'mic' });

const config = {
  recording: false,
};

buttonStart.addEventListener('click', () => {
  config.recording = true;

  const tuner = new Wad.Poly();
  tuner.setVolume(0);
  tuner.add(voice);

  voice.play();

  tuner.updatePitch();

  const logPitch = () => {
    if (config.recording) {
      console.log(tuner.pitch, tuner.noteName);
      requestAnimationFrame(logPitch);
    }
  };

  logPitch();
});

buttonStop.addEventListener('click', () => {
  voice.stop();
  config.recording = false;
});
