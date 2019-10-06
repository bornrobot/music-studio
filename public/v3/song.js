
class Song {

  constructor() {

    this.BandName = "Unknown";
    this.Tempo = 100;
    this.KeyOffset = 0;

    this.musicians = new Array();
  }
}

//Musician is probably the wrong name. Includes the songs notes for a midi channel
class Musician {

  constructor() {

    this.timeIntervals = new Array();
  }
}

class TimeInterval {

  constructor() {

    this.notes = new Array();
  }

  deepCopy() {

    let copy = new TimeInterval();

    for(let i=0; i < this.notes.length; i++) {

      copy.notes.push( this.notes[i].deepCopy() );
    }

    return copy;
  }

  print() {

    let str = "";

    for(let i=0; i < this.notes.length; i++) {
        str += this.notes[i].print();
    }

    return str;
  }
}
