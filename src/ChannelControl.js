import * as Tone from "tone"
import {useState, useEffect} from "react";
import {Paper, Slider, ToggleButton, Grid} from "@mui/material";



// see example: https://github.com/Tonejs/Tone.js/blob/dev/examples/mixer.html


const ChannelControl = ({track, events, soloChange, volumeProp}) => { // props: name, source,  event: {property, value, rampTime}, soloChange -  refrernce to function;

    const name = track.name;
    const channel = track.channel;

    const [soloed, setSoloed] = useState(false);
    const [muted, setMuted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [volume, setVolume] = useState(-60);
    const [pan, setPan] = useState(0);

    // const loaded = track.player.loaded;

    useEffect(() => { // kind of init function
        // if soundFile changed set the default values:
        handleVolume(-60);
        handlePan(0);
        handleMuted(false);
        handleSolo(false);
    }, [track.soundFile]);

    useEffect(()=> {
        const buffer = track ? track.player.buffer : null;
        if (buffer) buffer.onload = () => setLoaded(true)  ;
    }, [track] );

    useEffect(()=> {
        console.log("Volume from prop:", volumeProp);
        handleVolume(volumeProp);
    }, [volumeProp] );



    useEffect( () => {
            if (!events) return;
            if (events.length===0) return;
            //console.log("Events: ", events );

            for (let event of events) {
                //console.log(event);
                Tone.Transport.scheduleOnce( ()=> {
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
        }, [events]

    );



    const handleVolume = (volume, rampTime=0.05) => {
        //console.log("ChannelControl::handleVolume", volume)
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
        soloChange(name, solo)
    }


    return (
        <Paper elevation={4}>
            <Grid item container direction={"column"} justifyContent={"center"} rowSpacing={1} >
                <Grid item>
                    { loaded ? name : "Loading"}
                </Grid>
                <Grid item>
                    <Slider  orientation={"vertical"} sx={{height: 70 }}   value={volume} min={-36} max={6} onChange={(e) => handleVolume(e.target.value)} />
                </Grid>
                <Grid  item container direction={"row"} spacing={1} alignItems={"center"}>
                    <Grid item>L</Grid>
                    <Grid item> <Slider sx={{width:40}} min={-1} max={1} step={0.05} value={pan} onChange={(e) => handlePan(e.target.value)} /> </Grid>
                    <Grid item>R</Grid>
                </Grid>
                <Grid  item container direction={"row"} justifyContent={"center"} spacing={1}>
                    <Grid item>
                        <ToggleButton aria-label="Mute"  value="mute" onChange={ () => handleMuted(!muted) }  selected={muted} color={"secondary"}>M</ToggleButton>
                    </Grid>
                    <Grid item>
                        <ToggleButton aria-label="Solo" value="solo" onChange={ () => handleSolo(!soloed) } selected={soloed} color={"primary"}>S</ToggleButton>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}


ChannelControl.defaultProps = {
  name: "üks",
  source:  process.env.PUBLIC_URL+"/sounds/Arpege.mp3",
  stopped: true
};

export default ChannelControl;
