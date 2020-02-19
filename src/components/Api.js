import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
// import Select from "./Select";

class Api extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      timeZone: "",
      currentTime: "",
      zones: "",
      selectZone: "",
      selectedTime: "",
      selectedDate: "",
      selectedGmt: ""
    };
  }
  componentDidMount() {
    axios
      .get("https://worldtimeapi.org/api/ip")
      .then(response => {
        //console.log(response);
        this.setState({ timeZone: response.data });
      })
      .catch(error => console.log(error));

    axios
      .get("https://worldtimeapi.org/api/timezone")
      .then(response => {
        //console.log(response);
        this.setState({ zones: response.data });
      })
      .catch(error => console.log(error));

    setInterval(() => {
      this.dynamictime();
    }, 1000);
    //console.log('selected time:', this.state.selectedTime);
  }

  dynamictime = () => {
    this.setState({ currentTime: moment().format("MMMM Do YYYY, h:mm:ss a") });
  };
  selectHandler = event => {
    this.setState({ selectZone: event.target.value });
    this.setTime(event);
  };
  setTime = event => {
    let url = "https://worldtimeapi.org/api/timezone/" + event.target.value;
    // console.log(url);
    axios
      .get(url)
      .then(response => {
        //console.log(response);
        let time = response.data.datetime;
        let localTime = this.changeTimeFormat(time.split("T")[1].split(".")[0]);
        console.log(localTime);
        this.setState({
          selectedDate: time.split("T")[0],
          selectedTime: localTime,
          selectedGmt: time.includes("+")
            ? time.split("+")[1]
            : time.split("-")[1]
        });
        //console.log(this.state.selectedTime, time);
      })
      .catch(error => console.log(error));
  };
  changeTimeFormat(time) {
    let hours = time.split(":")[0];
    let mins = time.split(":")[1] + ":" + time.split(":")[2];
    let localTime = "";
    hours =
      hours > 12 ? hours - 12 : hours === 0 ? (hours = 12) : (hours = hours);
    localTime =
      time.split(":")[0] >= 12 ? `${hours}:${mins} PM` : `${hours}:${mins} AM`;
    return localTime;
  }
  render() {
    const {
      posts,
      timeZone,
      zones,
      selectZone,
      selectedTime,
      currentTime,
      selectedDate,
      selectedGmt
    } = this.state;
    let location = this.state.zones;
    return (
      <div>
        <center>
          <h1>Time Zone</h1>
          <p>Your Current Time Zone: {timeZone.timezone} </p>
          <p>Current Date & Time: {currentTime}</p>
          <select
            className="form-control col-sm-4"
            onChange={this.selectHandler}
          >
            <option value="">Choose Location</option>
            {location.length
              ? location.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))
              : ""}
          </select>
          <h2>{selectZone}</h2>
          {selectedDate !== "" && selectedDate !== undefined ? (
            <p>Date: {selectedDate}</p>
          ) : (
            ""
          )}
          {selectedTime !== "" && selectedTime !== undefined ? (
            <p>Time: {selectedTime}</p>
          ) : (
            ""
          )}
          {/* <Select /> */}
        </center>
      </div>
    );
  }
}

export default Api;
