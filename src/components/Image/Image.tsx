import React from 'react';
import { BaseProps, ImageComponentOptions } from '../../app.types';
import { Card } from '../Card/Card';

import './Image.css';

export const Image = (props: Readonly<ImageComponentOptions & BaseProps>) => {
    return (<Card>
        <div className='image-container'>
            <img 
                src={props.src} 
                alt={props.alt} />
        </div>
    </Card>);
}

export default Image;