import React from 'react'
import './Cab.less'
import {_zero} from '../../_internal/index';
import {DataLabor} from 'entity';
import Ux from "ux";
import Op from "./Op";
import Rdr from './UI.Render';

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "grid": ["query", "list", "tree"]
            })
            .rinit(["query"])
            .rinit(["tree"], true)
            .to()
    },
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        selected: undefined // 被选中的节点
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        // 验证当前组件是否准备完成
        const {reference, $key = "grid"} = this.props;
        const verified = Ux.verifyTreeList(reference, $key);
        if (!verified) {
            Op.initGrid(this);
        } else {
            this.setState({error: verified});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        Op.updateGrid(this, prevProps);
    }

    render() {
        const ref = this;
        return Ux.fxRender(this, () => {
            return Rdr.renderLayout(ref,
                <span>Hello</span>
            )
        });
    }
}

export default Component