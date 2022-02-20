import './App.css';
import * as Tone from "tone"
//import sound from "./60.ogg"
import {useState} from "react";
import ChannelControl from "./ChannelControl";
import {Button, IconButton, Paper, ThemeProvider} from "@mui/material";
import { createTheme } from '@mui/material/styles';



function App() {

  const [transportCommand, setTransportCommand] = useState("");
  const [time, setTime] = useState(0);
  const [activeEvents, setActiveEvents] =useState([]); // event: {property: "pan|volume", value:value, rampTime: xxx}


    const start = () => {
        console.log("Start");
        Tone.Transport.stop(+0.01); // strange tryout kind of works
        Tone.Transport.start(+0.1); // is this necessary
        //Tone.Transport.seconds = 0; // experiment with this
        Tone.Transport.scheduleRepeat((time) => {
            setTime(Math.floor(Tone.Transport.seconds));
        }, 1);
    }

    const stop = () => {
        //setStopped(true);
        //setTransportCommand("stop");
        console.log("Stop");
        //Tone.Transport.seconds = 0; // has now effect...
        Tone.Transport.stop(+0.1);
        //setTimeout( () => {Tone.Transport.seconds = 0; setTime(0);}, 200); // does not work
    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

  const tracks = [ // soundfiles must be ins public/sounds
      {name: "Fl1", soundFile:"fl.mp3"},
      {name: "Cl2", soundFile:"cl.mp3"},
      {name: "Kruup", soundFile:"kruup.mp3"},
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


  const events = [

      {   channel: "channelName",
          when: 0 , //time as string perhaps "0:30"?
          property: "volume|pan|mute|solo",
          value: 0,
          rampTime: 1 // don't handle ramp for now since it should happen in the child somehow... OR: seprate channels to array declared her and and their visual react
      }

      ];

  // command = start | stop | pause

  // test setEvent
    Tone.Transport.scheduleOnce( ()=>{
        const testEvent = {property:"solo", value: true};
        const tempEvents = activeEvents.slice();
        tempEvents[0] = testEvent;
        setActiveEvents(tempEvents);
    }, 10 );

    // something strange happens here... and gets into loop....
    Tone.Transport.scheduleOnce( ()=>{
        const testEvent = {property:"mute", value: true};
        const tempEvents = activeEvents.slice();
        tempEvents[0] = testEvent;
        setActiveEvents(tempEvents);
    }, 12 );
    //
    // Tone.Transport.scheduleOnce( ()=>{
    //     const testEvent = {property:"solo", value: true};
    //     const tempEvents = activeEvents.slice();
    //     tempEvents[1] = testEvent;
    //     setActiveEvents(tempEvents);
    // }, 14 );


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
                    { tracks.map( (track, index) => <td key={index}><ChannelControl name={track.name} soundFile={track.soundFile} event={activeEvents[index]}/></td>  )}
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
