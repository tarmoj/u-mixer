import './App.css';
import * as Tone from "tone"
//import sound from "./60.ogg"
import {useState} from "react";
import ChannelControl from "./ChannelControl";


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


  return (
    <div className="App">
      <header className="App-header">
        <p>
          U: mixer test test
        </p>
        <div>
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

      </header>

    </div>
  );
}

export default App;
