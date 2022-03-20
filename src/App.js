import './App.css';
import * as Tone from "tone"
import {useRef, useState} from "react";
import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Grid,
    LinearProgress, MenuItem,
    Paper, Select, TextareaAutosize,
    ThemeProvider
} from "@mui/material";
import { createTheme } from '@mui/material/styles';
import ChannelGroup from "./ChannelGroup";
import * as JSON5 from "json5";
import packageInfo from '../package.json';
import trackData from "./tracks.json";


const version = packageInfo.version;


const TimeLabel = () => {
    const [time, setTime] = useState(0);

    Tone.Transport.scheduleRepeat(() => {
        setTime(Math.floor(Tone.Transport.seconds));
    }, 1);

    return <span>Time: {Math.floor(time/60)} : {time%60}</span>

}



function App() {

    const defaultEventText = `[
// <- this is a comment    

// first is example, change it as you need    
{   trackName: "Fl_1", // name of the track or group where change will happen
    when: 10 , //time as string perhaps "0:30"?
    property: "volume", //"volume|pan|mute|solo",
    value: -24, // -36..6 for volume, -1 (left)..1 (right) for pan, true/false for solor or mute
    rampTime: 1, // during how long time in seconds the change will take place (for volume and pan)
},

{   trackName: "Fl_1", // empty template
     when: 12 , 
     property: "volume",
     value: 0,
     rampTime: 0.1,     
},
    
]`;

    const [counter, setCounter] = useState(0); // somehow Tone.loaded fires at start and then after all clips are loaded
    const [events, setEvents] = useState([]);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [eventText, setEventText] = useState(defaultEventText);
    const [pieceIndex, setPieceIndex] = useState(2); // index to the selected piece in tracks.json
    const [trackInfo, setTrackInfo] = useState(trackData[pieceIndex]); // array of trackinfo by groups, where channels and player are added

    const [time, setTime] = useState(0);
    //const [clipDuration, setClipDuration] = useState(300);

    const videoRef= useRef();
    const selectRef = useRef();



    const createChannel = () => {
        const channel = new Tone.Channel({ channelCount:2, volume:-90});
        //channel.connect(Tone.Destination); // not sure if here or in the component
        return channel;
    }

    const createPlayer = (soundFile) => {
        const source = process.env.PUBLIC_URL + "/sounds/" + soundFile;
        const newPlayer = new Tone.Player({
            url: source,
            loop: false,
            // onload: () => {
            //     console.log("Local onload -  loaded", soundFile);
            // }
        }).sync().start(0);
        //newPlayer.connect(channel);
        return newPlayer;
    }

    const prepareTrackInfo  = (index) => { // piece index in trackData (json)

        setCounter(0); // to activate the bacdrop loader progress

        if (trackInfo) {
            const currentTrackInfo = trackInfo;
            console.log("Dispose current channels and players"); // does it free the memory?
            for (let group of currentTrackInfo.trackGroups) {
                for (let track of group.tracks) {
                    if (track.channel) track.channel.dispose();
                    if (track.player) track.player.dispose();
                }
                if (group.channel) group.channel.dispose();
            }
        }


        const newTrackInfo = trackData[index];
        for (let group of newTrackInfo.trackGroups) {
            group.channel = createChannel(); // add Tone.Channel
            group.channel.volume.rampTo(0, 0.01); // set the value
            group.channel.toDestination();
            for (let track of group.tracks) {
                track.channel = createChannel();
                track.channel.connect(group.channel);
                track.player = createPlayer(track.soundFile);
                track.player.connect(track.channel);
            }
        }
        setTrackInfo(newTrackInfo);
        //setClipDuration(newTrackInfo.duration);
        console.log("New pieces duration is: ", newTrackInfo.duration);
    }

    const loadResources = (event) => {
        const index = event.target.value;
        console.log("Should set  piece to: ", index, trackData[index].title);
        stop(); // for any case
        setTimeout( ()=>{
            prepareTrackInfo(index);
            setPieceIndex(index);
        }, 200); // give some time to stop

    }



    const start = () => {
        console.log("Start");
        Tone.Transport.start("+0.1"); // is this necessary
        Tone.Transport.scheduleRepeat(() => {
           setTime(Math.floor(Tone.Transport.seconds));
           if (Tone.Transport.seconds>trackInfo.duration) {
               stop();
           }
        }, 1);
        if (videoRef.current) videoRef.current.play();
    }

    const pause = () => {
        Tone.Transport.pause("+0.01");
        if (videoRef.current)  videoRef.current.pause();
    }

    const stop = () => {
        console.log("Stop");
        Tone.Transport.stop("+0.05");
        setTime(0);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        Tone.Transport.cancel(0.1);
        setEvents([]);
    }


    Tone.loaded().then(() => {
        if (counter<2) {
            setCounter(counter+1);
            console.log("Loaded counter: ", counter);
        } else {
            //console.log("perhaps how loaded?")
        }
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
        // typography: { // has no effect on the size, only letters in buttons
        //     fontSize: 8,
        // },
    });



    const getRandomElement = (array) => {
        return array[Math.floor(Math.random()*array.length)];
    }


    const addRandomEvents = () => { //  , when="+0.1"?
        const currentEvents = events.slice(); // or should it be an empty array?

        let allTracks = [];

        for (let group of trackInfo.trackGroups) {

            allTracks.push(group.tracks);
        }
        allTracks = allTracks.flat();
        console.log("all tracks:", allTracks);

        for (let track of allTracks) {
            const trackName = track.name;
            console.log("track name: ", trackName, track);
            const property = getRandomElement(["volume", "pan"]); //, "solo", "mute"]);
            let value = 0;
            const minVolume = -36;
            const maxVolume = 6;
            switch (property) {
                case "volume": value = minVolume +  Math.random()*(maxVolume-minVolume); break;
                case "pan": value = -1 + Math.random()*2; break;
                case "solo": value = (Math.random() >= 0.5) ; break;
                case "mute": value = (Math.random() >= 0.5) ; break;
                default: console.log("unknown property", property); break;
            }
            const maxRamp = 2;
            const rampTime = (["pan", "volume"].includes(property)) ? 0.05 + Math.random()*maxRamp : 0;
            const newEvent = {
                trackName: trackName,
                when: Tone.Transport.seconds+0.5, //experiment with this
                property: property,
                value: value,
                rampTime: rampTime
            }
            console.log("created event: ", newEvent);
            currentEvents.push(newEvent); // not sure if triggers property change
        }
        setEvents(currentEvents);
    }


    const textToEvents = (text) => {
        let newEvents = [];
        try {
            newEvents = JSON5.parse(text);
        } catch (e) {
            console.log(e);
            alert("Error in parsing your input:" + e);
            return;
        }
        console.log("parsed events: ", newEvents);
        setEvents(newEvents);
        setEventText(text);
    }

    const eventAreaRef = useRef();
    const createEventDialog = () => {
        return (
            <Dialog open={eventDialogOpen} onClose={()=>setEventDialogOpen(false)}>
                <DialogTitle>Define changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The mixer change events are defined below as in JSON(5) format. <br />
                        Just follow the example,  copy the event template and change parameters as needed.<br />
                        NB! Change only the values of the fields (after :), not the format.
                        If there are many events, they must be separated by comma.<br />
                    </DialogContentText>
                    <TextareaAutosize style={{width:"100%"}} id="eventsArea" ref={eventAreaRef} defaultValue={eventText}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setEventDialogOpen(false)}>Cancel</Button>
                    <Button onClick={()=>{ textToEvents(eventAreaRef.current.value); setEventDialogOpen(false)}}>Apply</Button>
                </DialogActions>
            </Dialog>
        );
    };

    const [userTouched, setUserTouched]  = useState(false);

    const resumeAudio = () => {
        Tone.getContext().resume();
        console.log("Audio resume");
        setUserTouched(true);
        prepareTrackInfo(pieceIndex); // is this necessary here?
    }

    const columnsPerGroup = (pieceIndex===0) ? 6 : (pieceIndex===1) ? 4 : 12;

    // TODO: if a random element is set, it will be reset/rerendered every second beacouse of time/events, I guess...

    return (
        <ThemeProvider theme={darkTheme}>

            <Paper className={"App"}>
                <h1>
                    U: mixer test
                </h1>
                <small>v {version}</small>
                { !userTouched ?
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={  !userTouched }
                        >
                        <Button  variant={"contained"} onClick={()=>resumeAudio() }>Start and enable audio</Button>
                    </Backdrop>
                    :
                    <>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={  counter<2 }
                        >
                            <CircularProgress color="inherit" />

                        </Backdrop>
                        {createEventDialog()}
                        {  // show only video by Miimiline
                            pieceIndex===0 && <video  className={"videoFrame"} width={320} height={240} ref={videoRef}>
                            <source src={process.env.PUBLIC_URL + "/miimiline-small.mp4"}/>
                            Your browser does not support the video tag.
                        </video>
                        }


                        <div >

                            <Grid container direction={"column"} spacing={1} sx={{maxWidth:980}} >
                                <Grid item>
                                    <Select  ref={selectRef} value={pieceIndex} onChange={loadResources}>
                                        { trackData.map( (piece, index) => <MenuItem key={"pieceMenu"+index} value={index}>{piece.title}</MenuItem> )}
                                    </Select>
                                </Grid>
                                <Grid item container direction={"row"} spacing={1} >
                                    <Grid item>
                                        <Button aria-label={"Define events"} onClick={()=>setEventDialogOpen(true)} >Define events</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button aria-label={"Event"} onClick={()=>addRandomEvents("Fl_1")} >Random event</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button aria-label={"Play"} onClick={start} >Play</Button>
                                        <LinearProgress sx={{width:60}}  variant="determinate" value={100*time/trackInfo.duration} />
                                    </Grid>
                                    <Grid item>
                                        <Button aria-label={"Pause"} onClick={pause} >Pause</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button aria-label={"Stop"} onClick={stop}>Stop</Button>
                                    </Grid>
                                    <Grid item>
                                        <span>Time: {Math.floor(time/60)} : {time%60}</span>
                                    </Grid>
                                </Grid>


                                <Grid item container direction={"row"} spacing={1} alignItems={"center"} justifyContent={"center"} >

                                    {
                                        trackInfo.trackGroups.map( (tg, index) =>
                                        <Grid item  key={"channelGroupItem"+index} xs={columnsPerGroup}>

                                            <ChannelGroup key={"ChannelGroup"+index} name={tg.name} tracks={tg.tracks} events={events} channel={tg.channel} />

                                        </Grid>

                                    ) }

                                </Grid>
                            </Grid>

                        </div>
                    </>
                }

            </Paper>
        </ThemeProvider>
    );
}

export default App;
