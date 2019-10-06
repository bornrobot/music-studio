
WebMidi.enable(function (err) {

  if (err) console.log("An error occurred", err);

  let str = "No MIDI?";

  if(WebMidi.outputs.length > 0) {
    str = "";
    for(let i=0; i < WebMidi.outputs.length; i++) {
      str += "<br/><input type='radio' name='midiOut' value='" + i + "'> " + WebMidi.outputs[i].name + " [" + i + "]";
    }
  }
  $("#midiOuts").html(str);

  console.log(WebMidi.inputs);
  console.log(WebMidi.outputs);

});

let songsToGenerate = 10;
let songGen = new SongGenerator();
let interval = -1;
let midiDeviceIndex = 0;

function generateSongs() {
  console.log("Generating songs...");

  midiDeviceIndex = document.querySelector('input[name="midiOut"]:checked').value;
  songToGenerate = document.querySelector('input[name="numberOfSongs"]').value;

  generateSong();
}

function generateSong() {
  if(songsToGenerate > 0) {
    songGen.create();
    startRecording();
    songsToGenerate--;
  } else {
    console.log("Done. Stopped making songs");
  }
}
 
function resolveAfter(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, ms);
  });
}

async function startPerformance() {

  //return new Promise(resolve => {

  //pause for the recorder to startup. TODO: Hopefully we can trim that later...
  await resolveAfter(5000);
   
  //foreach time interval... (assuming all musicians have the same number of intervals!)
  for(interval=0; interval < songGen.song.musicians[0].timeIntervals.length; interval++) {

    //foreach musician...
    for(let i=0; i < songGen.song.musicians.length; i++) {
      if(interval < songGen.song.musicians[i].timeIntervals.length) { 
        playMidiNotes(songGen.song.musicians[i].timeIntervals[interval].notes);
      }
    }

    await resolveAfter((30 / songGen.song.Tempo) * 1000);
  }

/*
    for(currSongPosition = 0; currentSongPosition < songGen.song.melody.length; currentSongPosition++) {

      playMidiNote(songGen.song.melody[currentSongPosition]);

      if(songGen.song.rythm.length > currentSongPosition) {
        playMidiNote(songGen.song.rythm[currentSongPosition]);
      } 

      await resolveAfter((30 / songGen.song.Tempo) * 1000);
    } 
*/

    console.log("No more notes");
    interval = -1;

    stopRecordingAndSavePerformance();

  //}
}

function playMidiNotes(notes) {

    for(let i=0; i < notes.length; i++) {

	playMidiNote(notes[i]);
    }
}

function playMidiNote(note) {

  console.log("play " + note.print());

  var delay = 0;

  if(note.sustain > 0) {

    //var output = WebMidi.outputs[0];
    var output = WebMidi.outputs[midiDeviceIndex];

    if(output == undefined) {
      console.log("No MIDI output?");
      return;
    }

    // Play a chord on channel 7
    //output.playNote(["C3", "D#3", "G3"], 7);

    // Play a note at full velocity on all channels)
    //"all", 

    let midiNote = note.getNote();

    //Should really link the sustain to the tempo???

    output.playNote(
      midiNote,
      note.channel,
      {
        duration: note.sustain * 250,
        velocity: 127
      }
    );
  }
}
