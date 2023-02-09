import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ComponentData, isButtonComponentData, isConditionComponentData, isImageComponentData, isWeatherComponentData } from './app.types';
import './app.css';

import Weather from './components/Weather/Weather';
import Image from './components/Image/Image';
import Button from './components/Button/Button';
import Condition from './components/Condition/Condition';

const App = () => {
    const { id } = useParams<{ id: string }>();
    const [components, setComponents] = useState<Array<ComponentData>>([]);
    const [variables, setVariables] = useState([]);
    const [lists, setLists] = useState<Array<any>>([]);

    const fetchPageData = useCallback(async () => {
        const unparsedResult = await fetch(`http://localhost:3030/page/${id}`);
        const parsedResult = await unparsedResult.json();

        setVariables(parsedResult.data.variables);
        setLists(parsedResult.data.lists);

        setComponents(parsedResult.data.components);

        
    }, [id]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData])

    const onButtonClicked = (variableName: string, value: string) => {
        const currentCondition: any | undefined = components.find((component: ComponentData) => {
            if (isConditionComponentData(component)) {
                return component.options.variable === variableName;
            }
            
            return false;
        });

        if (!currentCondition) {
            console.log('condition not found by variable name');
            return;
        }

        setComponents([
            ...components.filter((component: ComponentData) => component.id !== currentCondition.id),
            {
                ...currentCondition,
                options:{
                    ...currentCondition.options,
                    value: value,
                }
            }
        ]);
    }

    const createComponentHtml = function (componentId: number) {
        const possibleComponent: ComponentData | undefined = components.find((component: ComponentData) => componentId === component.id);
        if (!possibleComponent) {
            return <div key={componentId}>Component from list not found</div>;
        }

        const component: ComponentData = possibleComponent;

        if (isWeatherComponentData(component)) {
            return <Weather 
                key={componentId}
                lat={component.options.lat} 
                lon={component.options.lon} />;
        }
        if (isImageComponentData(component)) {
            return <Image 
                key={componentId}
                src={component.options.src} 
                alt={component.options.alt} />;
        }
        if (isButtonComponentData(component)) {
            return <div key={componentId}
                onClick={() => {onButtonClicked(component.options.variable, component.options.value)}}>
                <Button 
                    text={component.options.text} 
                    variable={component.options.variable}
                    value={component.options.value} />
            </div>;
        }
        if (isConditionComponentData(component)) {
            const currentList: any | undefined = lists.find((list: any) => list.id === component.children);

            const currentVariable: any | undefined = 
                variables.find((variable: any) => component.options.variable === variable.name);
            
            if(!currentVariable) {
                return <div key={component.id}>Matching variable for condtion not found</div>;
            }

            return (<Condition key={component.id} isShown={component.options.value === 'show' ? true : false}>                     
                {currentList ? 
                    currentList.components.map((componentId: number) => {
                        return createComponentHtml(componentId);
                    })
                : ''}
                </Condition>
            );
        }
        return '<div>Component type not found.</div>';
    };

    if (!lists.length)
        return <div>loading</div>;

    /*TODO: Update this return statement to show all of the lists not just the first one
     Also, must solve the problem of rendering duplicate components because of the 
     recursive call to createComponentHtml when the component is a condition
    */
    return (
        <div className='phone-container'>
            {lists[0].components.map((componentId: number) => {
                return createComponentHtml(componentId);
            })}
        </div>
    );
};

export default App;
