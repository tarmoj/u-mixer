import './App.css';
import * as Tone from "tone"
//import sound from "./60.ogg"
import {useState} from "react";
import ChannelControl from "./ChannelControl";
import {Button, IconButton, Paper, ThemeProvider} from "@mui/material";
import { createTheme } from '@mui/material/styles';



// TODO: make different components -  MixerArea -> ChannelControls, ConrolArea -> Tone.Transport, progress, time etc
// TODO: make component ChannelGroup -  master track for 6 channels?

function App() {

  const [time, setTime] = useState(0);


    const start = () => {
        console.log("Start");
        Tone.Transport.stop("+0.01"); // strange tryout kind of works
        Tone.Transport.start("+0.1"); // is this necessary
        //Tone.Transport.seconds = 0; // experiment with this
        Tone.Transport.scheduleRepeat((time) => {
            setTime(Math.floor(Tone.Transport.seconds));
        }, 1);
    }

    const stop = () => {

        console.log("Stop");
        Tone.Transport.stop("+0.1");
        //setTimeout( () => {Tone.Transport.seconds = 0; setTime(0);}, 200); // does not work
    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

  const tracks = [ // soundfiles must be ins public/sounds
      {name: "Fl1", soundFile:"fl.mp3"},
      {name: "Cl1", soundFile:"cl.mp3"},
      {name: "Kruup1", soundFile:"kruup.mp3"},
      {name: "Fl2", soundFile:"fl.mp3"},
      {name: "Cl2", soundFile:"cl.mp3"},
      {name: "Kruup2", soundFile:"kruup.mp3"},

      // {name: "Fl3", soundFile:"fl.mp3"},
      // {name: "Cl3", soundFile:"cl.mp3"},
      // {name: "Kruup3", soundFile:"kruup.mp3"},
      // {name: "Fl4", soundFile:"fl.mp3"},
      // {name: "Cl4", soundFile:"cl.mp3"},
      // {name: "Kruup4", soundFile:"kruup.mp3"},

  ];

  const groups = [
      {firsTrack: 0, lastTrack:5, name: "Group1"}
  ]


  const events = [

      {   channel: "Fl1", // or index in the channel list
          when: 10 , //time as string perhaps "0:30"?
          property: "volume", //"volume|pan|mute|solo",
          value: -24,
          rampTime: 1, // don't handle ramp for now since it should happen in the child somehow... OR: seprate channels to array declared her and and their visual react
          executed: false
      },
      {   channel: "Fl1", // or index in the channel list
          when: 12 , //time as string perhaps "0:30"?
          property: "volume",
          value: 0,
          rampTime: 0.1, // don't handle ramp for now since it should happen in the child somehow... OR: seprate channels to array declared her and and their visual react
          executed: false
      },
      {   channel: "Cl1", // or index in the channel list
          when: 14 , //time as string perhaps "0:30"?
          property: "solo",
          value: true,
          rampTime: 0.1, // don't handle ramp for now since it should happen in the child somehow... OR: seprate channels to array declared her and and their visual react
          executed: false
      },

      ];


  const getEventList = (trackIndex) => {
      //const eventArray = [new Array(tracks.length)]; // array of arrays
      const trackEvents = events.filter( (event) => event.channel===tracks[trackIndex].name );
      /*for (let event of events) {
          let channelIndex = (typeof(event.channel)==="number") ? event.channel : tracks.findIndex( (track) => track.name===event.channel   ) ;
          console.log("event for track ", channelIndex);
          eventArray[channelIndex].push(event);
      }*/
      console.log("events: ", trackEvents);
      //setChannelEvents(eventArray);
      return trackEvents;
  };



    return (
    <ThemeProvider theme={darkTheme}>
    <Paper className={"App"}>
        <h1>
          U: mixer test
        </h1>
        <div className={"overflow"} >
            <table>
                <tbody>
                <tr>
                    { tracks.map( (track, index) =>
                        <td key={index}>
                            <ChannelControl name={track.name} soundFile={track.soundFile} events={getEventList(index)}/>
                        </td>
                    )}
                </tr>
                </tbody>
            </table>
        </div>
        <div>
          <Button aria-label={"Play"} onClick={start} >Play</Button>
          <Button onClick={stop}>Stop</Button>
        </div>
        <div>
            Time: {time}
        </div>

    </Paper>
    </ThemeProvider>
  );
}

export default App;
