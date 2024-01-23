import React, {useState} from "react";
import enUS from 'antd/locale/en_US';
import deDE from 'antd/locale/de_DE';
import dayjs from 'dayjs';
import 'dayjs/locale/de';

import {ConfigProvider, ConfigProviderProps, Layout, RadioChangeEvent, theme} from "antd";
import Page from "./page";

type Locale = ConfigProviderProps['locale'];

dayjs.locale('de');

const App: React.FC = () => {
    const [locale, setLocal] = useState<Locale>(deDE);

    const changeLocale = (e: RadioChangeEvent) => {
        const localeValue = e.target.value;
        setLocal(localeValue);
        if (!localeValue) {
            dayjs.locale('en');
        } else {
            dayjs.locale('de');
        }
    };

    return (<ConfigProvider locale={locale} >
            <Layout style={{minHeight: "100vh"}}>
                <Layout.Content style={{padding: '0 48px 48px'}}>
                    <Page/>
                </Layout.Content>
            </Layout>
        </ConfigProvider>)

};

export default App;
//
//
// {/*<div style={{ marginBottom: 16 }}>*/}
// {/*    <Radio.Group value={locale} onChange={changeLocale}>*/
// }
// {/*        <Radio.Button key="en" value={enUS}>*/
// }
// {/*            English*/
// }
// {/*        </Radio.Button>*/
// }
// {/*        <Radio.Button key="cn" value={deDE}>*/
// }
// {/*            German*/
// }
// {/*        </Radio.Button>*/
// }
// {/*    </Radio.Group>*/
// }
// {/*</div>*/
// }
