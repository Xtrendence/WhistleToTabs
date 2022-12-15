const buttonStart = document.getElementById('start');
const buttonStop = document.getElementById('stop');

const divOutput = document.getElementById('output');
const spanCurrentNote = document.getElementById('current-note');
const spanCurrentPitch = document.getElementById('current-pitch');

const inputWhistle = document.getElementById('whistle');
const inputMultiple = document.getElementById('multiple');

const voice = new Wad({ source: 'mic' });

const config = {
  recording: false,
};

const notes = {
  0: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  1: ['F2', 'A#2', 'D#3', 'G#3', 'C4', 'F4'],
  2: ['F#2', 'B2', 'E3', 'A3', 'C#4', 'F#4'],
  3: ['G2', 'C3', 'F3', 'A#3', 'D4', 'G4'],
  4: ['G#2', 'C#3', 'F#3', 'B3', 'D#4', 'G#4'],
  5: ['A2', 'D3', 'G3', 'C4', 'E4', 'A4'],
  6: ['A#2', 'D#3', 'G#3', 'C#4', 'F4', 'A#4'],
  7: ['B2', 'E3', 'A3', 'D4', 'F#4', 'B4'],
  8: ['C3', 'F3', 'A#3', 'D#4', 'G4', 'C5'],
  9: ['C#3', 'F#3', 'B3', 'E4', 'G#4', 'C#5'],
  10: ['D3', 'G3', 'C4', 'F4', 'A4', 'D5'],
  11: ['D#3', 'G#3', 'C#4', 'F#4', 'A#4', 'D#5'],
  12: ['E3', 'A3', 'D4', 'G4', 'B4', 'E5'],
  13: ['F3', 'A#3', 'D#4', 'G#4', 'C5', 'F5'],
  14: ['F#3', 'B3', 'E4', 'A4', 'C#5', 'F#5'],
  15: ['G3', 'C4', 'F4', 'A#4', 'D5', 'G5'],
  16: ['G#3', 'C#4', 'F#4', 'B4', 'D#5', 'G#5'],
  17: ['A3', 'D4', 'G4', 'C5', 'E5', 'A5'],
  18: ['A#3', 'D#4', 'G#4', 'C#5', 'F5', 'A#5'],
  19: ['B3', 'E4', 'A4', 'D5', 'F#5', 'B5'],
  20: ['C4', 'F4', 'A#4', 'D#5', 'G5', 'C6'],
  21: ['C#4', 'F#4', 'B4', 'E5', 'G#5', 'C#6'],
  22: ['D4', 'G4', 'C5', 'F5', 'A5', 'D6'],
  23: ['D#4', 'G#4', 'C#5', 'F#5', 'A#5', 'D#6'],
  24: ['E4', 'A4', 'D5', 'G5', 'B5', 'E6'],
};

function start() {
  buttonStart.classList.add('active');
  buttonStop.classList.remove('active');

  config.recording = true;

  const tuner = new Wad.Poly();
  tuner.setVolume(0);
  tuner.add(voice);

  voice.play();

  tuner.updatePitch();

  const logPitch = () => {
    if (config.recording) {
      if (tuner?.noteName) {
        spanCurrentNote.textContent = tuner.noteName;
        spanCurrentPitch.textContent = tuner.pitch;
      }

      detectNote(tuner.noteName);

      requestAnimationFrame(logPitch);
    }
  };

  logPitch();
}

function stop() {
  buttonStart.classList.remove('active');
  buttonStop.classList.add('active');

  voice.stop();
  config.recording = false;
}

function getNoteColor(note) {
  if (note.includes('2')) {
    return 'n2';
  } else if (note.includes('3')) {
    return 'n3';
  } else if (note.includes('4')) {
    return 'n4';
  } else if (note.includes('5')) {
    return 'n5';
  } else if (note.includes('6')) {
    return 'n6';
  }
}

function generateNoteColumn(column, notes) {
  let html = `<div class="header"><span>${column}</span></div>`;

  notes.reverse().forEach((note, index) => {
    html += `
			<div class="${note} ${getNoteColor(note)}"><span>${note}</span></div>
		`;
  });

  return html;
}

function clearNotes() {
  const current = divOutput.getElementsByClassName('active');
  for (let i = 0; i < current.length; i++) {
    current[i].classList.remove('active');
  }
}

function detectNote(note) {
  note = inputWhistle.checked ? adjustWhistle(note, 2) : note;

  if (note) {
    const elements = document.getElementsByClassName(note);

    if (elements) {
      if (inputMultiple.checked) {
        for (let i = 0; i < elements.length; i++) {
          elements[i]?.classList.add('active');

          setTimeout(() => {
            elements[i]?.classList.remove('active');
          }, 1000);
        }
      } else {
        clearNotes();

        const element = elements[0];
        element?.classList.add('active');

        setTimeout(() => {
          element?.classList.remove('active');
        }, 1000);
      }
    }
  }
}

function adjustWhistle(note, reduction) {
  if (note) {
    const sharp = note.includes('#');
    return sharp
      ? note.charAt(0) + note.charAt(1) + (parseInt(note.charAt(2)) - reduction)
      : note.charAt(0) + (parseInt(note.charAt(1)) - reduction);
  }
}

Object.keys(notes).forEach((key, index) => {
  divOutput.innerHTML += `<div class="column">${generateNoteColumn(
    key,
    notes[key]
  )}</div>`;
});

buttonStart.addEventListener('click', () => {
  start();
});

buttonStop.addEventListener('click', () => {
  stop();
});
