import { BaseProps } from "../../app.types";

type ConditionProps = Readonly<{ 
    isShown: boolean 
} & BaseProps>;

export const Condition = (props: ConditionProps) => {
    return (props.isShown ? <div>
        {props.children}
    </div> : <div></div>);
}

export default Condition;
// import React from "react";
// import { BaseProps, ConditionComponentOptions } from "../../app.types";

// type ConditionProps = ConditionComponentOptions & BaseProps;

// type ConditionState = {
//     childrenShown: boolean;
// };

// export class Condition extends React.Component<ConditionProps, ConditionState> {
//     state: ConditionState = {
//         childrenShown: false,
//     }

//     componentDidMount() {
//         console.log(this.props);
//     }

//     render(): React.ReactNode {
//         return(this.state.childrenShown ? <>
//             {this.props.children}
//         </> : '')
//     }
// }