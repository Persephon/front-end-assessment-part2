import { BaseProps } from '../../app.types';
import cloudy from '../../icons/cloudy.svg';
import clearDay from '../../icons/clear-day.svg';
import rain from '../../icons/rain.svg';

interface WeatherIconOptions {
    condition: string;
    conditionName: string;
    width: string;
}

export type WeatherIconProps = Readonly<WeatherIconOptions & BaseProps>;

export const WeatherIcon = (props: WeatherIconProps) => {
    switch (props.condition) {
        case 'cloudy':
            return (
                <img 
                    width={props.width} 
                    src={cloudy} 
                    alt={props.conditionName} />
            );
        case 'rain':
            return (
                <img 
                    width={props.width} 
                    src={rain} 
                    alt={props.conditionName} />
            );
        case 'clear-day':
            return (
                <img 
                    width={props.width} 
                    src={clearDay} 
                    alt={props.conditionName} />
            );
        default:
            return (<div>Can not find weather type</div>)
    }
}
