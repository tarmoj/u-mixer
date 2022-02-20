import * as Tone from "tone"
//import sound from "./Arpege.mp3";
import {useState, useEffect, useRef} from "react";
import {Paper, Slider, ToggleButton} from "@mui/material";



// see example: https://github.com/Tonejs/Tone.js/blob/dev/examples/mixer.html

// make tone.js elements live outside of react component



const ChannelControl = ({name, soundFile, event}) => { // props: name, source,  event: {property, value, rampTime}



    const [player, setPlayer] = useState(null);
    const [channel, setChannel] = useState(null);
    const [soloed, setSoloed] = useState(false);
    const [muted, setMuted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [volume, setVolume] = useState(0);
    const [pan, setPan] = useState(0);


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

    useEffect( () => {
            if (!event) return;
            console.log("Received event: ", event );
            if (event.property==="volume") {
                handleVolume(event.value, event.rampTime);
            } else if (event.property==="pan") {
                handlePan(event.value, event.rampTime);
            }  else if (event.property==="solo") {
                handleSolo(event.value); // not sure if it works this way or on the contrary...
            }
            else if (event.property==="mute") {
                handleMuted(event.value); // not sure if it works this way or on the contrary...
            }
        }, [event]

    );

    /*Tone.Transport.on("start",  ()=> {
        if (!player) return;
        console.log("player status: ", player.state);
        if (player.state !== "started") player.start(0)
    } );
    Tone.Transport.on("stop",  ()=> {
        if (!player) return;
        if (player.state !== "stopped") player.stop(0)
    } );*/



    // real stopping does not work though....
    // useEffect(
    //     () => {
    //         console.log("command:", command);
    //         if (player) {
    //             if (command==="start") {
    //                 player.start(0);
    //                 if (Tone.Transport.state !== "started") {
    //                     Tone.Transport.start(0);
    //                 }
    //             }
    //             else if (command==="stop") {
    //                 player.stop(0);
    //                 if (Tone.Transport.state !== "stopped") {
    //                     Tone.Transport.stop(0);
    //                 }
    //             }
    //         }
    //     },
    //     [command]
    // );

    const handleVolume = (volume, rampTime=0.05) => {
        console.log("ChannelControl::handleVolume", volume)
        if (channel) {
            if (!channel.muted) channel.volume.rampTo(volume, rampTime); // otherwise changing the channel volume will open the channel in muted state
            setVolume(volume);
        } else {
            console.log("channel is null");
        }

    }

    const handlePan = (pan, rampTime=0.05) => {
        if (channel) channel.pan.rampTo(pan, rampTime);
        setPan(pan);
    }

    const handleMuted = (mute) => {
        if (channel) channel.set({mute: mute });
        setMuted(mute);
    }

    const handleSolo = (solo) => {
        if (channel) channel.set({solo: solo });
        setSoloed(solo);
    }


    return (
        <Paper elevation={2}>
            <div>
                { loaded ? name : "Loading"}
            </div>
            <div className={"center"}>
                <Slider  orientation={"vertical"} sx={{height: 70 }}   value={volume} min={-36} max={12} onChange={(e) => handleVolume(e.target.value)} />
            </div>
            <div>
                L <Slider sx={{width:40}} min={-1} max={1} step={0.05} value={pan} onChange={(e) => handlePan(e.target.value)} /> R
            </div>
            <div>
                <ToggleButton aria-label="Mute"  value="mute" onChange={ () => handleMuted(!muted) }  selected={muted} color={"secondary"}>M</ToggleButton>
                <ToggleButton aria-label="Solo" value="solo" onChange={ () => handleSolo(!soloed) } selected={soloed} color={"primary"}>S</ToggleButton>
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
