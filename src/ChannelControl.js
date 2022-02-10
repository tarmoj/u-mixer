import * as Tone from "tone"
//import sound from "./Arpege.mp3";
import {useState, useEffect} from "react";


// see example: https://github.com/Tonejs/Tone.js/blob/dev/examples/mixer.html

const ChannelControl = ({name, soundFile, stopped}) => { // props: name, source, isMuted, isSolo

    const [channel, setChannel] = useState(null);
    const [player, setPlayer] = useState(null);

    useEffect(() => {

        if (channel === null ) {
            console.log("first start");
            makeChannel(soundFile);
        }
    }, []);

    // real stopping does not work though....
    useEffect(
        () => {
            console.log("Stopped:", stopped);
            // if (player) {
            //     if (stopped)
            //         player.stop();
            //     else
            //         player.start();
            // }
        },
        [stopped]
    );

    function makeChannel(soundFile) {

        const channel = new Tone.Channel(-3, -0.6).toDestination();


        // const player = new Tone.Player(sound);
        // player.connect(channel);
        // Tone.loaded().then(() => {
        //   player.sync();
        //   console.log("Ready for playback");
        //   player.start(0);
        // });
        const source = process.env.PUBLIC_URL+"/sounds/" + soundFile;

        const player = new Tone.Player({
            url: source,
            loop: true,
            onload: () => console.log("Local onload -  loaded", name, soundFile)
        }).sync().start(0);
        player.connect(channel);
        // Tone.loaded().then(() => {
        //       //player.sync();
        //       console.log("Ready for playback");
        //       //player.start(0);
        // });

        setChannel(channel);
        setPlayer(player);

    }


    const setVolume = (event) => {
        const volume = event.target.value;
        console.log(volume);
        channel.set({volume: volume });
    }

    const setPan = (event) => {
        const pan = event.target.value;
        console.log(pan);
        channel.set({pan: pan });
    }

    const setMuted = (event) => {
        const mute = event.target.checked;
        console.log(mute);
        channel.set({mute: mute });
    }

    const setSolo = (event) => {
        const solo = event.target.checked;
        console.log(solo);
        channel.set({solo: solo });
    }


    return (
        <>
            <div>
                Channel: {name}
            </div>
            <div>
                Volume: <input  min={-70} max={12} type={"range"} onInput={setVolume} />
            </div>
            <div>
                Pan: <input  min={-1} max={1} step={0.05} type={"range"} onInput={setPan} />
            </div>
            <div>
                Mute: <input type={"checkbox"} onInput={ setMuted } />
                Solo: <input type={"checkbox"} onInput={ setSolo } />
            </div>

        </>
    );
}


ChannelControl.defaultProps = {
  name: "üks",
  source:  process.env.PUBLIC_URL+"/sounds/Arpege.mp3",
  stopped: true
};

export default ChannelControl;
