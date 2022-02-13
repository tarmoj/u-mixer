import './App.css';
import * as Tone from "tone"
//import sound from "./60.ogg"
import {useState} from "react";
import ChannelControl from "./ChannelControl";
import {Paper, ThemeProvider} from "@mui/material";
import { createTheme } from '@mui/material/styles';



function App() {

  const [stopped, setStopped] = useState(true);


    const start = () => {
        setStopped(false);
        Tone.Transport.start(0);
    }

    const stop = () => {
        setStopped(true);
        Tone.Transport.stop(0);
    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });



  return (
    <ThemeProvider theme={darkTheme}>
    <Paper className={"App"}>
        <p>
          U: mixer test
        </p>
        <div className={"center"}>
            <table>
                <tbody>
                <tr>
                    <td>
                        <ChannelControl name={"fl"} soundFile={"fl.mp3"} stopped={stopped}/>
                    </td>
                    <td>
                        <ChannelControl name={"cl"} soundFile={"cl.mp3"} stopped={stopped}/>
                    </td>
                    <td>
                        <ChannelControl name={"kruup"} soundFile={"kruup.mp3"} stopped={stopped}/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div>
          <button onClick={start}>Play</button>
          <button onClick={stop}>Stop</button>

        </div>

    </Paper>
    </ThemeProvider>
  );
}

export default App;
