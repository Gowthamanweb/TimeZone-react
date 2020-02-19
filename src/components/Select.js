import React, { Component } from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption
} from "mdbreact";

class Select extends Component {
  constructor() {
    super();
    this.state = {
      zones: "",
      seleczone: "",
      selectedTime: "",
      selectedDate: "",
      selectedGmt: ""
    };
  }
  componentDidMount() {
    axios
      .get("https://worldtimeapi.org/api/timezone")
      .then(response => {
        //console.log(response);
        this.setState({ zones: response.data });
      })
      .catch(error => console.log(error));
  }

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
        this.setState({
          selectedDate: time.split("T")[0],
          selectedTime: time.split("T")[1].split(".")[0],
          selectedGmt: time.includes("+")
            ? time.split("+")[1]
            : time.split("-")[1]
        });
        //console.log(this.state.selectedTime, time);
      })
      .catch(error => console.log(error));
  };
  render() {
    const { zones, selectedTime, selectedDate } = this.state;
    return (
      <div>
        <MDBSelect label="Example label" onChange={this.selectHandler}>
          <MDBSelectInput selected="Choose option" />
          <MDBSelectOptions search>
            <MDBSelectOption disabled>Choose your option</MDBSelectOption>
            {zones.length
              ? zones.map(zone => (
                  <MDBSelectOption key={zone} value={zone}>
                    {zone}
                  </MDBSelectOption>
                ))
              : ""}
          </MDBSelectOptions>
        </MDBSelect>
        <p>{selectedDate}</p>
        <p>{selectedTime}</p>
      </div>
    );
  }
}

export default Select;
