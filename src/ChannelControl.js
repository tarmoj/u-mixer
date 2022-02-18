import * as Tone from "tone"
//import sound from "./Arpege.mp3";
import {useState, useEffect, useRef} from "react";
import {Paper, Slider, ToggleButton} from "@mui/material";



// see example: https://github.com/Tonejs/Tone.js/blob/dev/examples/mixer.html

// make tone.js elements live outside of react component



const ChannelControl = ({name, soundFile, stopped}) => { // props: name, source, isMuted, isSolo



    const [player, setPlayer] = useState(null);
    const [channel, setChannel] = useState(null);
    const [soloed, setSoloed] = useState(false);
    const [muted, setMuted] = useState(false);
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
            console.log("Create player for: ", soundFile);

            if (player===null) {

                const source = process.env.PUBLIC_URL + "/sounds/" + soundFile;
                const channel = new Tone.Channel(0, -0.5).toDestination();
                const player = new Tone.Player({
                    url: source,
                    loop: true,
                    onload: () => {
                        console.log("Local onload -  loaded", name, soundFile);
                        setLoaded(true);
                    }
                }).sync().start(0);
                player.connect(channel);

                setChannel(channel);
                setPlayer(player);
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

    const setVolume = (event) => {
        const volume = event.target.value;
        console.log(volume);
        if (channel) {
            if (!channel.muted) channel.volume.rampTo(volume, 0.05); // otherwise changing the channel volume will open the channel in muted state
        }
    }

    const setPan = (event) => {
        const pan = event.target.value;
        console.log(pan);
        if (channel) channel.pan.rampTo(pan, 0.05);
    }

    const handleMuted = (event) => {
        //const mute = event.target.checked;
        const mute = !muted; // with toggle button there is no ecent, I guess
        console.log(mute);
        if (channel) channel.set({mute: mute });
        setMuted(mute);
    }

    const handleSolo = (event) => {
        //const solo = event.target.checked;
        const solo = !soloed;
        console.log(solo);
        if (channel) channel.set({solo: solo });
        setSoloed(solo);
    }


    return (
        <Paper elevation={2}>
            <div>
                { loaded ? name : "Loading"}
            </div>
            <div className={"center"}>
                <Slider  orientation={"vertical"} sx={{height: 70 }}   defaultValue={0}  min={-36} max={12} onChange={setVolume} />
            </div>
            <div>
                L <Slider sx={{width:40}} min={-1} max={1} step={0.05} defaultValue={0} onChange={setPan} /> R
            </div>
            <div>
                <ToggleButton aria-label="Mute"  value="mute" onChange={ handleMuted }  selected={muted} color={"secondary"}>M</ToggleButton>
                <ToggleButton aria-label="Solo" value="solo" onChange={ handleSolo } selected={soloed} color={"primary"}>S</ToggleButton>
            </div>

        </Paper>
    );
}


ChannelControl.defaultProps = {
  name: "üks",
  source:  process.env.PUBLIC_URL+"/sounds/Arpege.mp3",
  stopped: true
};

export default ChannelControl;
