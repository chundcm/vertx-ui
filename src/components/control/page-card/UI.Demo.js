import React from 'react'
import Ux from "ux";
import {PageCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {children} = this.props;
        return (
            <PageCard reference={this}>
                {children};
            </PageCard>
        )
    }
}

export default Component