import * as Tone from "tone"
import {useState, useEffect, useRef} from "react";
import {Paper, Slider, ToggleButton} from "@mui/material";



// see example: https://github.com/Tonejs/Tone.js/blob/dev/examples/mixer.html


const ChannelControl = ({name, soundFile, events, masterChannel}) => { // props: name, source,  event: {property, value, rampTime}


    const [player, setPlayer] = useState(null);
    const [channel, setChannel] = useState(null);
    const [soloed, setSoloed] = useState(false);
    const [muted, setMuted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [volume, setVolume] = useState(0);
    const [pan, setPan] = useState(0);


    useEffect(() => {

            if (player===null) {
                console.log("Create player for: ", soundFile);

                const source = process.env.PUBLIC_URL + "/sounds/" + soundFile;
                const channel = new Tone.Channel(0, 0);
                channel.connect(Tone.Destination);
                // TODO:
                // if (masterChannel) {
                //     console.log("Connect to masterChannel");
                //     channel.disconnect(Tone.Destination);
                //     channel.connect(masterChannel);
                // } else {
                //     console.log("Connect to Tone.Destination");
                //     channel.toDestination();
                // }

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
            if (masterChannel) {
                console.log("connect to masteChannel", name, masterChannel);
                channel.disconnect(Tone.getDestination());
                channel.connect(masterChannel);
            }
        }, [masterChannel]

    );


    useEffect( () => {
            if (!events) return;
            if (events.length===0) return;
            console.log("Events: ", events );

            for (let event of events) {
                console.log(event);
                Tone.Transport.scheduleOnce( (time)=> {
                    if (event.property === "volume") {
                        handleVolume(event.value, event.rampTime);
                    } else if (event.property === "pan") {
                        handlePan(event.value, event.rampTime);
                    } else if (event.property === "solo") {
                        handleSolo(event.value); // not sure if it works this way or on the contrary...
                    } else if (event.property === "mute") {
                        handleMuted(event.value); // not sure if it works this way or on the contrary...
                    }
                }, event.when);
            }
        }, [events, channel]

    );



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
