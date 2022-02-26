import './App.css';
import * as Tone from "tone"
import {useState} from "react";
import ChannelControl from "./ChannelControl";
import {Button, Paper, ThemeProvider} from "@mui/material";
import { createTheme } from '@mui/material/styles';
import ChannelGroup from "./ChannelGroup";



// TODO: make component ChannelGroup -  master track for 6 channels?

const Control = () => {

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
        //setTime(0);
    }

    return (
        <>
            <div>
                <Button aria-label={"Play"} onClick={start} >Play</Button>
                <Button onClick={stop}>Stop</Button>
            </div>
            <div>
                Time: {time}
            </div>
        </>
    );
}

function App() {

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

  const tracks = [ // soundfiles must be ins public/sounds
      {name: "Fl_1", soundFile:"Fl_1.mp3"},
      {name: "Fl_2", soundFile:"Fl_2.mp3"},
      {name: "Fl_3", soundFile:"Fl_3.mp3"},
      {name: "Fl_4", soundFile:"Fl_4.mp3"},
      {name: "Fl_5", soundFile:"Fl_5.mp3"},

      {name: "Cl_1", soundFile:"Cl_1.mp3"},
      {name: "Cl_2", soundFile:"Cl_2.mp3"},
      {name: "Cl_3", soundFile:"Cl_3.mp3"},
      {name: "Cl_4", soundFile:"Cl_4.mp3"},
      {name: "Cl_5", soundFile:"Cl_5.mp3"},

      {name: "Vl_1", soundFile:"Vl_1.mp3"},
      {name: "Vl_2", soundFile:"Vl_2.mp3"},
      {name: "Vl_3", soundFile:"Vl_3.mp3"},
      {name: "Vl_4", soundFile:"Vl_4.mp3"},
      {name: "Vl_5", soundFile:"Vl_5.mp3"},

      {name: "Vlc_1", soundFile:"Vlc_1.mp3"},
      {name: "Vlc_2", soundFile:"Vlc_2.mp3"},
      {name: "Vlc_3", soundFile:"Vlc_3.mp3"},
      {name: "Vlc_4", soundFile:"Vlc_4.mp3"},
      {name: "Vlc_5", soundFile:"Vlc_5.mp3"},

  ];

  const groups = [
      {firsTrack: 0, lastTrack:5, name: "Group1"}
  ]


  const events = [
/*
      {   trackName: "Fl1", // or index in the channel list
          when: 10 , //time as string perhaps "0:30"?
          property: "volume", //"volume|pan|mute|solo",
          value: -24,
          rampTime: 1, // don't handle ramp for now since it should happen in the child somehow... OR: seprate trackNames to array declared her and and their visual react
         
      },
      {   trackName: "Fl1", // or index in the channel list
          when: 12 , //time as string perhaps "0:30"?
          property: "volume",
          value: 0,
          rampTime: 0.1, // don't handle ramp for now since it should happen in the child somehow... OR: seprate trackNames to array declared her and and their visual react
         
      },
      {   trackName: "Cl1", // or index in the channel list
          when: 14 , //time as string perhaps "0:30"?
          property: "solo",
          value: true,
          rampTime: 0.1, // don't handle ramp for now since it should happen in the child somehow... OR: seprate channels to array declared her and and their visual react
         
      },

      {   trackName: "Group1", // or index in the channel list
          when: 6 , //time as string perhaps "0:30"?
          property: "volume",
          value: 6,
          rampTime: 2, // don't handle ramp for now since it should happen in the child somehow... OR: seprate channels to array declared her and and their visual react
         
      },
*/
      ];

    return (
    <ThemeProvider theme={darkTheme}>
    <Paper className={"App"}>
        <h1>
          U: mixer test
        </h1>
        <div >
            <table>
                <tbody>
                <tr>
                    <td>
                        <ChannelGroup name={"Fl"} tracks={tracks.slice(0,5)} events={events} />
                    </td>

                    <td>
                        <ChannelGroup name={"Cl"} tracks={tracks.slice(5,10)} events={events} />
                    </td>
                    <tr>

                        <td>
                            <ChannelGroup name={"Vl"} tracks={tracks.slice(10,15)} events={events} />
                        </td>
                        <td>
                            <ChannelGroup name={"Vlc"} tracks={tracks.slice(15,20)} events={events} />
                        </td>
                    </tr>
                    {/*{ tracks.map( (track, index) =>
                        <td key={index}>
                            <ChannelControl name={track.name} soundFile={track.soundFile} events={getEventList(index)}/>
                        </td>
                    )}*/}
                </tr>
                </tbody>
            </table>
        </div>
        <Control />

    </Paper>
    </ThemeProvider>
  );
}

export default App;
