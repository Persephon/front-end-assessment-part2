import React from 'react';
import { BaseProps, ButtonComponentOptions } from '../../app.types';
import { Card } from '../Card/Card';

import './Button.css';

export const Button = (props: Readonly<ButtonComponentOptions & BaseProps>) => {
    return (<Card>
        <div className='button-container'>
            <div>{props.text}</div>
        </div>
    </Card>);
}

export default Button;