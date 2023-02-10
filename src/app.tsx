import { useParams } from 'react-router';
import { BaseProps, ComponentData, isButtonComponentData, isConditionComponentData, isImageComponentData, isWeatherComponentData, ListData, VariableData } from './app.types';
import './app.css';

import Weather from './components/Weather/Weather';
import Image from './components/Image/Image';
import Button from './components/Button/Button';
import Condition from './components/Condition/Condition';
import React from 'react';

/*
TODO: Add loading images for the app and the weather component to prevent flashing and improve UX
TODO: Add icons to the button components
TODO: Add css preprocessor
*/

type AppProps = { pageId: string } & BaseProps;

type AppState = {
    components: Array<ComponentData>; 
    variables: Array<VariableData>;
    lists: Array<ListData>;
};

class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        components: [],
        variables: [],
        lists: [],
    };

    componentDidMount () {
        this.loadPageData();
    }

    /*
        Assumption: the first list inclueds all of the components 
        that are condtional components or are not included inside a conditional component.
        Therefore, we can loop through the initial list to display the components necessary.
    */
    render () {
        if (!this.state.lists.length)
            return <div>loading</div>;

        return (
            <div className='phone-container'>
                {this.state.lists[0].components.map((componentId: number) => {
                    return this.createComponentHtml(componentId);
                })}
            </div>
        );
    }
    
    createComponentHtml (componentId: number) {
        const possibleComponent: ComponentData | undefined = this.state.components
            .find((component: ComponentData) => componentId === component.id);

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
                onClick={() => {this.onButtonClicked(component.options.variable, component.options.value)}}>
                <Button 
                    text={component.options.text} 
                    variable={component.options.variable}
                    value={component.options.value} />
            </div>;
        }
        if (isConditionComponentData(component)) {
            const currentList: ListData | undefined = this.state.lists.find((list: ListData) => list.id === component.children);

            const currentVariable: VariableData | undefined = 
                this.state.variables.find((variable: any) => component.options.variable === variable.name);
            
            if(!currentVariable) {
                return <div key={component.id}>Matching variable for condtion not found</div>;
            }

            return (<Condition key={component.id} isShown={component.options.value === currentVariable.value ? true : false}>                     
                {currentList ? 
                    currentList.components.map((componentId: number) => {
                        return this.createComponentHtml(componentId);
                    })
                : ''}
                </Condition>
            );
        }
        return '<div>Component type not found.</div>';
    };

    onButtonClicked (variableName: string, value: string) {
        const currentVariable: VariableData | undefined = this.state.variables.find((variable: VariableData) => {
            return variable.name === variableName;
        });

        if (!currentVariable) {
            console.log('variable not found by variable name');
            return;
        }

        this.setState({
            components: this.state.components,
            lists: this.state.lists,
            variables: [
                ...this.state.variables.filter((variable: VariableData) => variable.name !== variableName),
                {
                    ...currentVariable,
                    value: value,
                }
            ]
        })
    }

    async loadPageData () {
        const unparsedResult = await fetch(`http://localhost:3030/page/${this.props.pageId}`);
        const parsedResult = await unparsedResult.json();

        this.setState({
            components: parsedResult.data.components,
            lists: parsedResult.data.lists,
            variables: parsedResult.data.variables ? parsedResult.data.variables.map((variable: VariableData) => {
                return {
                    ...variable,
                    value: variable.initialValue,
                }
            }) : [],
        });
    }
}

function withParams<P>(Component: any) {
    return (props: P) => <Component {...props} pageId={useParams<{id: string}>().id} />;
}

export default withParams(App);
