import * as Tone from "tone"
import {useState, useEffect, useRef} from "react";
import {Grid, Paper, Slider, ToggleButton} from "@mui/material";
import ChannelControl from "./ChannelControl";




const ChannelGroup = ({name, tracks, events }) => {

    const [volume, setVolume] = useState(0);
    //const [pan, setPan] = useState(0);
    const [channel, setChannel] = useState(null);
    const [soloed, setSoloed] = useState(false);
    const [muted, setMuted] = useState(false);
    const [trackSolos, setTrackSolos] = useState(new Array(10)); // define 10 by default

    useEffect(() => {
        console.log("Setup masterChannel: ", name);
        const channel = new Tone.Channel({ channelCount:2}).toDestination();
        setChannel(channel);
    }, []);

    useEffect( () => {
            const groupEvents = getGroupEventList();
            if (!groupEvents) return;
            if (groupEvents.length===0) return;
            //console.log("Events: ", groupEvents );

            for (let event of groupEvents) {
                console.log(event);
                Tone.Transport.schedule( ()=> {
                    if (event.property === "volume") {
                        handleVolume(event.value, event.rampTime);
                    // } else if (event.property === "pan") {
                    //     handlePan(event.value, event.rampTime);
                    } else if (event.property === "solo") {
                        handleSolo(event.value);
                    } else if (event.property === "mute") {
                        handleMuted(event.value);
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

    // const handlePan = (pan, rampTime=0.05) => {
    //     if (channel) channel.pan.rampTo(pan, rampTime);
    //     setPan(pan);
    // }

    const handleMuted = (mute) => {
        if (channel) channel.set({mute: mute });
        setMuted(mute);
    }

    const handleSolo = (solo) => {
        if (channel) channel.set({solo: solo });
        setSoloed(solo);
    }

    const getTrackEventList = (trackName) => {
        const track =  tracks.find( (t) => t.name === trackName );
        const trackEvents = events.filter( (event) => event.trackName===track.name );
        //console.log("events: ", trackEvents);
        return trackEvents;
    };

    const getGroupEventList = () => {
        const groupEvents = events.filter( (event) => event.trackName===name );
        //console.log("events: ", groupEvents);
        return groupEvents;
    };

    const getWidth = ( () => {
        const width = tracks.length * 80; return Math.max(200, width) }) ;

    const handleChildSoloChange= (trackName, solo) => {
        const index = tracks.findIndex((t) => t.name === trackName );
        const currentSolos = trackSolos; // no deep copy here since we don'y want re-rednder
        currentSolos[index] = solo;
        console.log("Solos array:", currentSolos);
        if (currentSolos.some( (item) => item===true )) {
            handleSolo(true);
        } else {
            handleSolo(false);
        }
        setTrackSolos(currentSolos);
    }

    return (
        <Paper elevation={2} sx={{width: getWidth() }}>
            <Grid item container direction={"column"} rowSpacing={1} alignItems={"center"} >

                <Grid item container direction={"row"} spacing={1} justifyContent={"flex-start"} alignItems={"center"} >
                    <Grid item>{name}</Grid>
                    <Grid item>
                        <ToggleButton  aria-label="Mute"  value="mute" onChange={ () => handleMuted(!muted) }  selected={muted} color={"secondary"}>M</ToggleButton>
                    </Grid>
                    <Grid item>
                        <ToggleButton  aria-label="Solo" value="solo" onChange={ () => handleSolo(!soloed) } selected={soloed} color={"primary"}>S</ToggleButton>
                    </Grid>
                    <Grid item>
                        <Slider  sx={{width: 60 }}   value={volume} min={-36} max={6} onChange={(e) => handleVolume(e.target.value)} />
                    </Grid>
                    <Grid item container direction={"row"} spacing={1}>
                        { tracks.map( (track, index) =>
                            <Grid item key={index}>
                                <ChannelControl name={track.name} soundFile={track.soundFile} events={getTrackEventList(track.name)} masterChannel={channel} soloChange={handleChildSoloChange}/>
                            </Grid>
                        )}
                    </Grid>

                </Grid>
            </Grid>


        </Paper>
    );
}


export default ChannelGroup;
