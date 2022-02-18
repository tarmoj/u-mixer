import './App.css';
import * as Tone from "tone"
//import sound from "./60.ogg"
import {useState} from "react";
import ChannelControl from "./ChannelControl";
import {Button, IconButton, Paper, ThemeProvider} from "@mui/material";
import { createTheme } from '@mui/material/styles';



function App() {

  const [stopped, setStopped] = useState(true);
  const [time, setTime] = useState(0);

  let timeFunction;

    const start = () => {
        //setStopped(false);
        console.log("Start");
        //Tone.Transport.seek(0); // seek does not exist
        Tone.Transport.start(0);
        //Tone.Transport.seconds = 0; // this seems to stop the players.
        Tone.Transport.scheduleRepeat((time) => {
            setTime(Math.floor(Tone.Transport.seconds));
        }, 1);
    }

    const stop = () => {
        //setStopped(true);

        console.log("Stop");
        //Tone.Transport.seconds = 0;
        Tone.Transport.stop(+0.1);
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
                    { tracks.map( (track, index) => <td key={index}><ChannelControl name={track.name} soundFile={track.soundFile}/></td>  )}
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
