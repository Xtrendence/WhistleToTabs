const buttonStart = document.getElementById('start');
const buttonStop = document.getElementById('stop');
const buttonSaveSettings = document.getElementById('save-settings');
const buttonClear = document.getElementById('clear');
const buttonPlay = document.getElementById('play');

const divOutput = document.getElementById('output');
const divTabs = document.getElementById('tabs');

const spanCurrentNote = document.getElementById('current-note');
const spanCurrentPitch = document.getElementById('current-pitch');

const inputWhistle = document.getElementById('whistle');
const inputMultiple = document.getElementById('multiple');
const inputSingle = document.getElementById('single');
const inputNoteColorMode = document.getElementById('note-color-mode');
const inputTabOnWhistle = document.getElementById('tab-on-whistle');
const inputTabOnClick = document.getElementById('tab-on-click');
const inputPlayOnClick = document.getElementById('play-on-click');
const inputDarkMode = document.getElementById('dark-mode');
const inputKey = document.getElementById('key');
const inputMinor = document.getElementById('minor');
const inputPentatonic = document.getElementById('pentatonic');
const inputSpeed = document.getElementById('speed');

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
      const currentNote = spanCurrentNote.textContent;

      if (tuner?.noteName) {
        spanCurrentNote.textContent = tuner.noteName;
        spanCurrentPitch.textContent = tuner.pitch;
      }

      detectNote(
        tuner.noteName,
        tuner.noteName && currentNote !== tuner.noteName
      );

      requestAnimationFrame(logPitch);
    }
  };

  logPitch();
}

function stop() {
  buttonStart.classList.remove('active');
  buttonStop.classList.add('active');

  clearNotes();
  clearCurrent();

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

function getFretForKey(key) {
  key = key.toLowerCase();

  switch (key) {
    case 'e':
      return 0;
    case 'f':
      return 1;
    case 'f#':
      return 2;
    case 'g':
      return 3;
    case 'g#':
      return 4;
    case 'a':
      return 5;
    case 'a#':
      return 6;
    case 'b':
      return 7;
    case 'c':
      return 8;
    case 'c#':
      return 9;
    case 'd':
      return 10;
    case 'd#':
      return 11;
  }
}

function playNote(string, fret) {
  const file = `./mp3/${string}-${fret}.mp3`;
  const audio = document.createElement('audio');
  audio.src = file;
  audio.classList.add('hidden');
  document.body.appendChild(audio);
  audio.play();
  audio.addEventListener('ended', () => {
    audio.remove();
  });
}

function handleNoteClick(column, index) {
  if (inputTabOnClick.checked) {
    outputTab(column, index + 1, undefined, true);
  }

  if (inputPlayOnClick.checked) {
    playNote(index, column);
  }
}

function generateNoteColumn(column, notes) {
  let html = `<div class="header"><span>${column}</span></div>`;

  notes.reverse().forEach((note, index) => {
    html += `
			<div onclick="handleNoteClick(${column}, ${index}, undefined, true)" 
			data-fret="${column}" data-index="${
      index + 1
    }" class="note ${note} ${getNoteColor(note)}" data-note="${getNote(
      note
    )}" index-${index + 1}"><span>${note}</span></div>
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

function clearCurrent() {
  spanCurrentNote.textContent = '-';
  spanCurrentPitch.textContent = '-';
}

function removeTab(tab, id) {
  tab.remove();

  try {
    const current = localStorage.getItem('tabs')
      ? JSON.parse(localStorage.getItem('tabs'))
      : [];

    const removed = current.filter((item) => item.id !== id);

    localStorage.setItem('tabs', JSON.stringify(removed));
  } catch (e) {
    console.log(e);
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function outputTab(fret, index, id, save) {
  const current = localStorage.getItem('tabs')
    ? JSON.parse(localStorage.getItem('tabs'))
    : [];

  let removeId = id
    ? id
    : new Date().getTime() + '-' + randomInt(100000, 999999);

  if (!id) {
    while (current.some((item) => item.id === removeId)) {
      removeId = new Date().getTime() + '-' + randomInt(100000, 999999);
    }
  }

  const line =
    fret > 9 ? '<div class="line-4"></div>' : '<div class="line-3"></div>';

  let output = `
		<div class="block" onClick="removeTab(this, '${removeId}')">
			${
        index === 1
          ? '<div class="line-2"></div> ' + fret + ' <div class="line-2"></div>'
          : line
      }<br/>
			${
        index === 2
          ? '<div class="line-2"></div> ' + fret + ' <div class="line-2"></div>'
          : line
      }<br/>
			${
        index === 3
          ? '<div class="line-2"></div> ' + fret + ' <div class="line-2"></div>'
          : line
      }<br/>
			${
        index === 4
          ? '<div class="line-2"></div> ' + fret + ' <div class="line-2"></div>'
          : line
      }<br/>
			${
        index === 5
          ? '<div class="line-2"></div> ' + fret + ' <div class="line-2"></div>'
          : line
      }<br/>
			${
        index === 6
          ? '<div class="line-2"></div> ' + fret + ' <div class="line-2"></div>'
          : line
      }<br/>
		</div>
	`;

  divTabs.innerHTML += output;

  if (save) {
    current.push({
      id: removeId,
      fret,
      index,
    });

    localStorage.setItem('tabs', JSON.stringify(current));
  }
}

function detectNote(originalNote, changed) {
  const note = inputWhistle.checked
    ? adjustWhistle(originalNote, 2)
    : originalNote;

  if (note) {
    let elements = document.getElementsByClassName(note);

    if (inputSingle.checked) {
      elements = Array.from(elements).filter((element) => {
        return element.classList.contains('index-1');
      });
    }

    if (elements) {
      if (inputMultiple.checked) {
        for (let i = 0; i < elements.length; i++) {
          if (!elements[i]?.classList.contains('disabled')) {
            elements[i]?.classList.add('active');

            setTimeout(() => {
              if (spanCurrentNote.textContent !== note) {
                elements[i]?.classList.remove('active');
              }
            }, 1000);

            if (changed) {
              try {
                const fret = parseInt(elements[i].getAttribute('data-fret'));
                const index = parseInt(elements[i].getAttribute('data-index'));
                outputTab(fret, index, undefined, true);
              } catch (error) {
                console.log(error);
              }
            }
          } else {
            // TODO: Suggest similar note.
          }
        }
      } else {
        clearNotes();

        let element;
        Array.from(elements).forEach((node) => {
          if (!element && !node.classList.contains('disabled')) {
            element = node;
          }
        });

        if (!element?.classList.contains('disabled')) {
          element?.classList.add('active');

          setTimeout(() => {
            if (spanCurrentNote.textContent !== note) {
              element?.classList.remove('active');
            }
          }, 1000);

          if (changed && inputTabOnWhistle.checked) {
            try {
              const fret = parseInt(element.getAttribute('data-fret'));
              const index = parseInt(element.getAttribute('data-index'));
              outputTab(fret, index, undefined, true);
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          // TODO: Suggest similar note.
        }
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

function disableAllNotes() {
  const elements = document.getElementsByClassName('note');

  Array.from(elements).forEach((element) => {
    element.classList.add('disabled');
  });
}

function enableAllNotes() {
  const elements = document.getElementsByClassName('note');

  Array.from(elements).forEach((element) => {
    element.classList.remove('disabled');
  });
}

function enableColumnNotes(fret, notes) {
  const column = document.getElementsByClassName(`fret-${fret}`)[0];
  const columnNotes = column.getElementsByTagName('div');

  Array.from(columnNotes).forEach((note, index) => {
    if (notes.includes(index)) {
      note.classList.remove('disabled');
    }
  });
}

function showPentatonic(fret) {
  if (fret >= 4) {
    enableColumnNotes(fret - 4, [2]);
  }

  if (fret >= 3) {
    enableColumnNotes(fret - 3, [3, 4]);
  }

  if (fret >= 2) {
    enableColumnNotes(fret - 2, [1, 2, 5, 6]);
  }

  // Key
  enableColumnNotes(fret, [1, 2, 3, 4, 5, 6]);

  enableColumnNotes(fret + 2, [3, 4, 5]);
  enableColumnNotes(fret + 3, [1, 2, 6]);
  enableColumnNotes(fret + 4, [3]);
  enableColumnNotes(fret + 5, [1, 2, 4, 5, 6]);
  enableColumnNotes(fret + 7, [1, 3, 4, 5, 6]);
  enableColumnNotes(fret + 8, [2]);
  enableColumnNotes(fret + 9, [3, 4]);
  enableColumnNotes(fret + 10, [1, 2, 5, 6]);
}

function showAeolian(fret) {
  if (fret >= 4) {
    enableColumnNotes(fret - 4, [1, 2, 6]);
  }

  if (fret >= 3) {
    enableColumnNotes(fret - 3, [3, 4, 5]);
  }

  if (fret >= 2) {
    enableColumnNotes(fret - 2, [1, 2, 4, 5, 6]);
  }

  if (fret >= 1) {
    enableColumnNotes(fret - 1, [3]);
  }

  // Key
  enableColumnNotes(fret, [1, 2, 3, 4, 5, 6]);

  enableColumnNotes(fret + 1, [2]);
  enableColumnNotes(fret + 2, [1, 3, 4, 5, 6]);
  enableColumnNotes(fret + 3, [1, 2, 5, 6]);
  enableColumnNotes(fret + 4, [3, 4]);
  enableColumnNotes(fret + 5, [1, 2, 3, 4, 5, 6]);
  enableColumnNotes(fret + 7, [1, 2, 3, 4, 5, 6]);
  enableColumnNotes(fret + 8, [1, 2, 6]);
  enableColumnNotes(fret + 9, [3, 4, 5]);
  enableColumnNotes(fret + 10, [1, 2, 4, 5, 6]);
}

function detectKey() {
  try {
    const key = inputKey.value;

    const headers = document.getElementsByClassName('header');

    Array.from(headers).forEach((header) =>
      header.classList.remove('active-key')
    );

    if (empty(key)) {
      enableAllNotes();
    } else {
      disableAllNotes();

      const fret = inputMinor.checked
        ? getFretForKey(key)
        : getFretForKey(key) - 2;

      headers[fret].classList.add('active-key');

      if (inputPentatonic.checked) {
        showPentatonic(fret);
      } else {
        showAeolian(fret);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function getNote(textContent) {
  if (textContent.includes('#')) {
    return textContent.substring(0, 2).toUpperCase();
  }

  return textContent.charAt(0).toUpperCase();
}

function saveSettings() {
  try {
    const whistleMode = inputWhistle.checked;
    const showMultiple = inputMultiple.checked;
    const singleString = inputSingle.checked;
    const noteColorMode = inputNoteColorMode.checked;
    const tabOnWhistle = inputTabOnWhistle.checked;
    const tabOnClick = inputTabOnClick.checked;
    const playOnClick = inputPlayOnClick.checked;
    const darkMode = inputDarkMode.checked;
    const musicKey = inputKey.value;
    const minorKey = inputMinor.checked;
    const pentatonicScale = inputPentatonic.checked;
    const playSpeed = inputSpeed.value;

    localStorage.setItem(
      'settings',
      JSON.stringify({
        whistleMode,
        showMultiple,
        singleString,
        noteColorMode,
        tabOnWhistle,
        tabOnClick,
        playOnClick,
        darkMode,
        musicKey,
        minorKey,
        pentatonicScale,
        playSpeed,
      })
    );
  } catch (error) {
    console.log(error);
  }
}

function loadSettings() {
  try {
    const data = localStorage.getItem('settings');

    if (data) {
      const settings = JSON.parse(data);

      inputWhistle.checked = settings.whistleMode;
      inputMultiple.checked = settings.showMultiple;
      inputSingle.checked = settings.singleString;
      inputNoteColorMode.checked = settings.noteColorMode;
      inputTabOnWhistle.checked = settings.tabOnWhistle;
      inputTabOnClick.checked = settings.tabOnClick;
      inputPlayOnClick.checked = settings.playOnClick;

      inputDarkMode.checked = settings.darkMode;
      if (inputDarkMode.checked) {
        setTheme('dark');
      }

      inputKey.value = settings.musicKey;
      inputMinor.checked = settings.minorKey;
      inputPentatonic.checked = settings.pentatonicScale;
      inputSpeed.value = settings.playSpeed;
    }
  } catch (error) {
    console.log(error);
  }
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    return;
  }

  document.documentElement.classList.add('light');
  document.documentElement.classList.remove('dark');
}

const currentTabs = localStorage.getItem('tabs');
if (currentTabs) {
  try {
    const array = JSON.parse(currentTabs);
    array.forEach((item) => {
      try {
        outputTab(item.fret, item.index, item.id, false);
      } catch (e) {}
    });
  } catch (e) {}
}

loadSettings();

Object.keys(notes).forEach((key, index) => {
  divOutput.innerHTML += `<div data-fret="${index}" class="column fret-${index}">${generateNoteColumn(
    key,
    notes[key]
  )}</div>`;
});

inputNoteColorMode.addEventListener('change', () => {
  divOutput.classList.contains('note-color')
    ? divOutput.classList.remove('note-color')
    : divOutput.classList.add('note-color');
});

inputDarkMode.addEventListener('change', () => {
  setTheme(inputDarkMode.checked ? 'dark' : 'light');
});

inputMinor.addEventListener('change', () => {
  detectKey();
});

inputPentatonic.addEventListener('change', () => {
  detectKey();
});

inputKey.addEventListener('input', () => {
  detectKey();
});

buttonStart.addEventListener('click', () => {
  start();
});

buttonStop.addEventListener('click', () => {
  stop();
});

buttonSaveSettings.addEventListener('click', () => {
  saveSettings();
});

buttonClear.addEventListener('click', () => {
  divTabs.innerHTML = '';
  localStorage.removeItem('tabs');
});

buttonPlay.addEventListener('click', () => {
  try {
    const speed = parseInt(inputSpeed.value);
    const tabs = localStorage.getItem('tabs');
    const array = JSON.parse(tabs);

    let delay = 0;
    array.forEach((item) => {
      try {
        setTimeout(() => {
          playNote(item.index - 1, item.fret);
        }, delay);
      } catch (e) {}

      delay += speed;
    });
  } catch (e) {}
});

function empty(value) {
  if (
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).length === 0
  ) {
    return true;
  }
  if (
    value === null ||
    typeof value === 'undefined' ||
    value.toString().trim() === ''
  ) {
    return true;
  }
  return false;
}
