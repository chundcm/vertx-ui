### 1.说明

入口说明文件，什么都不做，仅连接左右面板和提交后的面板。

### 2.Mock数据

这里使用了Mock数据，数据格式：`inited.json`：

```js
    {
        "pterms": [
            {
                "key": "25e1b1cf-2f7c-42ac-b20b-33aed8946255",
                "termName": "付款项1",
                "price": 230.45,
                "type": "SINGLE",
                "typeText": "单人账单",
                "label": "标签1",
                "openTime": "2018-06-23T08:42:34",
                "active": true,
                "roomType": "0f51e472-ab22-46e1-951b-9458a634867c",
                "termId": "edc9a43b-37ac-4b68-9ebb-c3a0ab58ee5c"
            },
            {
                "key": "92197b5a-090f-4b12-bd64-57c0d23f478b",
                "termName": "付款项2",
                "price": 1200,
                "type": "MULTI",
                "typeText": "多人账单",
                "label": "标签2",
                "openTime": "2018-09-23T14:42:34",
                "active": false,
                "roomType": "1a1e8ea8-e769-42f8-99c9-cf6d36f56e8c",
                "termId": "ce3f61fd-ee17-45f1-b5c3-42810f613726"
            }
        ]
    }
```

### 3.代码

```js
    import React from 'react';
    import Ux from 'ux';
    import {FormPanel} from 'app';
    import Left from './UI.Left';
    import Right from './UI.Right';
    import $inited from './inited';

    class Component extends React.PureComponent {
        render() {
            return (
                <FormPanel reference={this} $inited={$inited}>
                    {Ux.aiGrid([12, 12],
                        <Left {...this.props}
                              reference={this}/>,
                        <Right {...this.props}
                               reference={this}
                               $inited={$inited}/>)}
                </FormPanel>
            )
        }
    }

    export default Component
```