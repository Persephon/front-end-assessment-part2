import React from 'react';
import { BaseProps, WeatherComponentOptions } from '../../app.types';
import { Card } from '../Card/Card';
import { WeatherIcon } from '../WeatherIcon/WeatherIcon';
import './Weather.css';

type WeatherProps = WeatherComponentOptions & BaseProps;

type WeatherState = {
    condition: string; 
    conditionName: string;
    lat: string;
    lon: string;
    location: string;
    temperature: number;
    unit: string;
    upcoming: UpcomingWeatherData[];
    isLoading: boolean;
};

type UpcomingWeatherData = {
    day: string;
    condition: string;
    conditionName: string;
}

export class Weather extends React.Component<WeatherProps, WeatherState> {
    state: WeatherState = {
        condition: '', 
        conditionName: '',
        lat: '',
        lon: '',
        location: '',
        temperature: 0,
        unit: '',
        upcoming: [],
        isLoading: true,
    };

    componentDidMount () {
        this.loadWeatherData();
    }

    loadWeatherData () {
        fetch(`http://localhost:3030/integration/weather?lat=${this.props.lat}&lon=${this.props.lon}`)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    condition: res.data.condition,
                    conditionName: res.data.conditionName,
                    lat: res.data.lat,
                    lon: res.data.lon,
                    location: res.data.location,
                    temperature: res.data.temperature,
                    unit: res.data.unit,
                    upcoming: res.data.upcomming,
                    isLoading: false,
                });
            }) 
            .catch(error => console.log(error));
    }

    render() {
        if(this.state.isLoading) {
            return <div>Loading...</div>;
        }

        return (<Card>
            <div className='weather-container'>
                <div>
                    <div className='current-weather'>
                        <div>
                            <WeatherIcon 
                                condition={this.state.condition}
                                conditionName={this.state.conditionName}
                                width='55px'
                            />
                        </div>
                        <div>
                            <div className='temperature'>
                                <span>{this.state.temperature}</span>
                                <span>&#176;</span>
                                <span>{this.state.unit.toUpperCase()}</span>
                            </div>
                            <div className='conditions'>{this.state.conditionName}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='location'>{this.state.location}</div>
                    <div className='upcoming'>
                        {this.state.upcoming.map((upcomingWeather: UpcomingWeatherData) => {
                            return <div key={upcomingWeather.day}>
                                <WeatherIcon 
                                    condition={upcomingWeather.condition}
                                    conditionName={upcomingWeather.conditionName}
                                    width='35px'
                                />
                                <div>{upcomingWeather.day}</div>
                            </div>;
                        })}
                    </div>
                </div>
            </div>
        </Card>);
    }
}

export default Weather;