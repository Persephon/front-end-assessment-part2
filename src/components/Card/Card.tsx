import { BaseProps } from '../../app.types';
import './Card.css';

export const Card = (props: Readonly<BaseProps>) => {
    return (<div className="card">
        {props.children}
    </div>)
}