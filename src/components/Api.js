import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment';


class Api extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            timeZone:'',
            currentTime: '',
            zones: '',
            selectZone: '',
            selectedTime: ''
        }
    }
    componentDidMount() {
        // axios.get('https://jsonplaceholder.typicode.com/posts').then(response => {console.log(response);
        //     this.setState({posts: response.data});
        // })
        // .catch(error => console.log(error));
        axios.get('http://worldtimeapi.org/api/ip')
        .then(response => {console.log(response);
            this.setState({timeZone: response.data})
        })
        .catch(error => console.log(error));

        axios.get('http://worldtimeapi.org/api/timezone')
        .then(response => {console.log(response);
            this.setState({zones: response.data})
        })
        .catch(error => console.log(error));

        setInterval(() => {
            this.dynamictime()
        }, 1000);
        console.log('selected time:', this.state.selectedTime);
    }
    dynamictime = () =>{
        this.setState({currentTime: moment().format('MMMM Do YYYY, h:mm:ss a')})
    }
    selectHandler = (event) => {
        this.setState({selectZone : event.target.value});
        this.setTime(event);
    }
    setTime = (event) =>{
        let url = 'http://worldtimeapi.org/api/timezone/' + event.target.value;
        console.log(url);
        axios.get(url)
        .then(response => {console.log(response);
            let time = moment(response.data.datetime).format('MMMM Do YYYY, h:mm:ss a');
            this.setState({selectedTime: response.data.datetime});
            console.log(this.state.selectedTime, time);
        })
        .catch(error => console.log(error));

    }
    render() {
        const {posts, timeZone, zones, selectZone, selectedTime, currentTime} = this.state;
        let location = this.state.zones
        return (
            <div>
                <center>
                    <h1>Time Zone</h1>
                    <p>Your Current Time Zone: {timeZone.timezone} </p>
                    <p>Current Date & Time: {currentTime}</p>
                    <select onChange={this.selectHandler}>
                        <option>Select location</option>
                        {location.length ? location.map(loc => <option key={loc} value={loc}>{loc}</option>) : '' }
                    </select>
                    <h2>{selectZone}</h2>
                    <p>{selectedTime}</p>
                </center>

                {/* {
                    posts.length ? posts.map(post =><div key={post.id}> <h2>{post.title}</h2> <p>{post.body}</p></div>) : 'No posts'
                } */}
            </div>
        )
    }
}

export default Api
