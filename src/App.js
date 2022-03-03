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
    LinearProgress,
    Paper, TextareaAutosize,
    ThemeProvider
} from "@mui/material";
import { createTheme } from '@mui/material/styles';
import ChannelGroup from "./ChannelGroup";
import * as JSON5 from "json5";
import packageInfo from '../package.json';


const version = packageInfo.version;



// TODO: make component ChannelGroup -  master track for 6 channels?

const Control = () => {

    const [time, setTime] = useState(0);


    const start = () => {
        console.log("Start");
        Tone.Transport.stop("+0.01"); // strange tryout kind of works
        Tone.Transport.start("+0.1"); // is this necessary
        //Tone.Transport.seconds = 0; // experiment with this
        Tone.Transport.scheduleRepeat(() => {
            setTime(Math.floor(Tone.Transport.seconds));
        }, 1);
    }

    const stop = () => {
        console.log("Stop");
        Tone.Transport.stop("+0.1");
    }

    const clipDuration = 300;

    return (
        <div>
            <Button aria-label={"Play"} onClick={start} >Play</Button>
            {/*<Grid item>
                    <Button aria-label={"Pause"} onClick={()=>Tone.Transport.pause("+0.05")} >Pause</Button>
                </Grid>*/}
            <Button aria-label={"Stop"} onClick={stop}>Stop</Button>
            Time: {Math.floor(time/60)} : {time%60}
            <LinearProgress sx={{width:60}}  variant="determinate" value={100*time/clipDuration} />

        </div>
    );
};

function App() {

    const [counter, setCounter] = useState(0); // somehow Tone.loaded fires at start and then after all clips are loaded
    const [events, setEvents] = useState([]);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);

//test
    Tone.loaded().then(() => {
        if (counter<1) {
            setCounter(counter+1);
            console.log("Loaded counter: ", counter);
        } else {
            console.log("perhaps how loaded?")
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

    const getRandomElement = (array) => {
        return array[Math.floor(Math.random()*array.length)];
    }

    //const events = [
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
    //];

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

    const [eventText, setEventText] = useState(defaultEventText);




    const addRandomEvents = () => { //  , when="+0.1"?
        const currentEvents = events.slice(); // or should it be an empty array?

        for (let track of tracks) {
            const trackName = track.name;
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


    return (
        <ThemeProvider theme={darkTheme}>
            <Paper className={"App"}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={ counter<1 }
                    // onClick={handleClose}
                ><CircularProgress color="inherit" />
                </Backdrop>
                {createEventDialog()}
                <h1>
                    U: mixer test
                </h1>
                <small>v {version}</small>
                <div >

                    <Grid container direction={"column"} spacing={1}>
                        <Grid item container direction={"row"} spacing={1}>
                            <Grid item>
                                <Button aria-label={"Define events"} onClick={()=>setEventDialogOpen(true)} >Define events</Button>
                            </Grid>
                            <Grid item>
                                <Button aria-label={"Event"} onClick={()=>addRandomEvents("Fl_1")} >Random event</Button>
                            </Grid>
                            <Grid item>
                                <Control />
                            </Grid>
                        </Grid>

                        <Grid item container direction={"row"} spacing={1}>
                            <Grid item>
                                <ChannelGroup name={"Fl"} tracks={tracks.slice(0,4)} events={events} />
                            </Grid>
                            <Grid item>

                                <ChannelGroup name={"Cl"} tracks={tracks.slice(5,9)} events={events} />

                            </Grid>
                        </Grid>
                        <Grid item container direction={"row"} spacing={1}>
                            <Grid item>

                                <ChannelGroup name={"Vl"} tracks={tracks.slice(10,14)} events={events} />

                            </Grid>
                            <Grid item>

                                <ChannelGroup name={"Vlc"} tracks={tracks.slice(15,19)} events={events} />

                            </Grid>
                        </Grid>
                    </Grid>
                </div>


            </Paper>
        </ThemeProvider>
    );
}

export default App;
